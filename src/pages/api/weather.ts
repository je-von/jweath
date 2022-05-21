import type { NextApiRequest, NextApiResponse } from 'next';

function convert(temp) {
  const icon = temp.current.condition.icon.replace(
    '//cdn.weatherapi.com/weather/64x64/',
    ''
  );
  return {
    name:
      temp.location.name +
      (!temp.location.region.includes('(general)')
        ? `, ${temp.location.region}`
        : ''),
    country: temp.location.country,
    icon,
    condition: temp.current.condition.text,
    feelslike: temp.current.feelslike_c,
    feelslike_f: temp.current.feelslike_f,
    temperature: temp.current.temp_c,
    temperature_f: temp.current.temp_f,
    wind: {
      kph: temp.current.wind_kph,
      degree: temp.current.wind_kph,
      dir: temp.current.wind_dir,
    },
    humidity: temp.current.humidity,
    cloud: temp.current.cloud,
  };
}

async function getTopWeather(location) {
  try {
    const weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
    );
    const temp = await weatherResponse.json();

    return convert(temp);
  } catch (e: any) {
    return null;
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { location, top, multi } = req.query;
  if (req.method === 'GET') {
    if (location) {
      let response = {};
      if (top) {
        const data = await getTopWeather(location);
        if (data) {
          const message = 'Data fetched from WeatherAPI';
          res.setHeader(
            'Cache-Control',
            'public, s-maxage=1200, stale-while-revalidate=600'
          );

          response = {
            data,
            message,
          };
        }
      } else {
        try {
          const weatherResponse = await fetch(
            `https://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
          );
          const temp = await weatherResponse.json();

          const data: any[] = [];
          for (const t of temp) {
            const weather = await getTopWeather(t.url);
            if (weather) {
              weather.url = t.url;
              data.push(weather);
            }
          }

          if (data) {
            const message = 'Data fetched from WeatherAPI';
            res.setHeader(
              'Cache-Control',
              'public, s-maxage=1200, stale-while-revalidate=600'
            );
            response = {
              data,
              message,
            };
          }
        } catch (e: any) {
          return res.status(500).json({ message: e.message });
        }
      }
      if (response) return res.status(200).json(response);
      return res.status(500);
    }
    if (multi) {
      const favorites = (multi as string).split(',');
      // return res.status(200).json({ data: favorites[0] });

      try {
        const data: any[] = [];

        for (const f of favorites) {
          const weather = await getTopWeather(f);
          if (weather) {
            weather.url = f;
            data.push(weather);
          }
        }

        if (data) {
          const message = 'Data fetched from WeatherAPI';
          res.setHeader(
            'Cache-Control',
            'public, s-maxage=1200, stale-while-revalidate=600'
          );
          const response = {
            data,
            message,
          };
          return res.status(200).json(response);
        }
      } catch (e: any) {
        return res.status(500).json({ message: e.message });
      }
    }
  }

  return res.status(404);
}
