import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { location } = req.query;
  if (req.method === 'GET' && location) {
    let message = '';
    try {
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
      );
      const temp = await weatherResponse.json();
      const icon = temp.current.condition.icon.replace(
        '//cdn.weatherapi.com/weather/64x64/',
        ''
      );

      const data = {
        name: temp.location.name,
        region: temp.location.region,
        country: temp.location.country,
        icon,
        condition: temp.current.condition.text,
        feelslike: temp.current.feelslike_c,
        temperature: temp.current.temp_c,
      };
      message = 'Data fetched from WeatherAPI';
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=1200, stale-while-revalidate=600'
      );
    
      return res.status(200).json({
        data,
        message,
      });
    } catch (e: any) {
      return res.status(500).json({ message: e.message });
    }

  }
  
  return res.status(404);
}
