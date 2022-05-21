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
    temperature: temp.current.temp_c,
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
  const { location, top } = req.query;
  if (req.method === 'GET' && location) {
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
          if (weather) data.push(weather);
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

  return res.status(404);
}
