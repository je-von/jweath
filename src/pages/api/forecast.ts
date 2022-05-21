import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { location } = req.query;
  if (req.method === 'GET' && location) {
    try {
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
      );
      const temp = await weatherResponse.json();
      if (temp) {
        const forecast = temp.forecast.forecastday[0];
        const getIcon = (icon) =>
          icon.replace('//cdn.weatherapi.com/weather/64x64/', '');
        const data = {
          name:
            temp.location.name +
            (!temp.location.region.includes('(general)')
              ? `, ${temp.location.region}`
              : ''),
          country: temp.location.country,
          icon: getIcon(temp.current.condition.icon),
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
          date: forecast.date,
          avgtemp_c: forecast.day.avgtemp_c,
          avgtemp_f: forecast.day.avgtemp_f,
          chance_of_rain: forecast.day.daily_chance_of_rain,
          avg_icon: getIcon(forecast.day.condition.icon),
          avg_condition: forecast.day.condition.text,
          hour: forecast.hour.map((h) => ({
            time: h.time,
            condition: h.condition.text,
            icon: getIcon(h.condition.icon),
            temp_c: h.temp_c,
            temp_f: h.temp_f,
            chance_of_rain: h.chance_of_rain,
          })),
        };

        const message = 'Data fetched from WeatherAPI';
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=1200, stale-while-revalidate=600'
        );

        return res.status(200).json({
          data,
          message,
        });
      }
    } catch (e: any) {
      return res.status(500);
    }
  }
  return res.status(404);
}
