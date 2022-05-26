/* eslint-disable no-nested-ternary */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { FaAngleLeft } from 'react-icons/fa';
import { BallTriangle } from 'react-loader-spinner';
import { Parallax } from 'react-scroll-parallax';
import useSWR from 'swr';

import { fetcher } from '@/lib/fetcher';

const WeatherDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: weather, isValidating } = useSWR<any>(
    `/api/forecast?location=${slug}`,
    fetcher
  );

  const content = (child) => (
    <div className="relative z-50">
      <div className="mx-auto flex w-full max-w-[800px] items-center justify-center">
        <div className="mx-4 mt-16  flex w-full items-center justify-between">
          <Link href={'/#search'} passHref>
            <FaAngleLeft className="cursor-pointer text-2xl text-white drop-shadow-xl" />
          </Link>
          <p className="text-base text-gray-400 drop-shadow-lg">
            {new Date().toLocaleDateString('en-us', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      {child}
    </div>
  );

  if (isValidating && !weather)
    return content(
      <div className="mt-10 flex h-[80vh] w-full items-center justify-center">
        <BallTriangle color="#f6ca00" />
      </div>
    );

  return content(
    <div className="h-screen drop-shadow-2xl">
      <div className="mx-auto my-10 flex w-full  max-w-[800px] flex-col items-center justify-between px-5">
        <div className="flex w-full items-center justify-between ">
          <div className="w-3/4">
            <Parallax speed={3} className="w-full">
              <h1 className="text-white drop-shadow-lg">
                {weather?.data?.name}
              </h1>
            </Parallax>
            <Parallax speed={-1}>
              <p className="text-lg text-gray-400 drop-shadow-lg">
                {weather?.data?.country}
              </p>
            </Parallax>
          </div>
          <Parallax speed={2}>
            <Image
              className="drop-shadow-lg"
              src={`/assets/weather/${weather?.data?.icon}`}
              width={80}
              height={80}
              alt={'weather icon'}
            />
          </Parallax>
        </div>
        <Parallax speed={-3} className="w-full text-center">
          <div className="w-full text-left text-lg leading-6 text-white drop-shadow-lg">
            It&apos;s <i>{weather?.data?.condition}</i> and feels like{' '}
            <b>{weather?.data?.feelslike}&#176;C</b>.
            <p>
              It&apos;s actually <b>{weather?.data?.temperature}&#176;C</b>{' '}
              right now.
            </p>
            <p>
              Today&apos;s average temperature will be around{' '}
              <b>{weather?.data?.avgtemp_c}&#176;C</b> with{' '}
              <i>{weather?.data?.chance_of_rain}%</i> chance of rain.
              <p>
                Today&apos;s wind will be {weather?.data?.wind.kph}km/h{' '}
                {weather?.data?.wind.degree}&#176; {weather?.data?.wind.dir}.
              </p>
            </p>
          </div>
        </Parallax>
      </div>

      <div
        id="weather-day-container"
        className="mt-8 flex h-[22rem] w-[98.5vw] items-center justify-between overflow-x-scroll overflow-y-hidden scrollbar-thin scrollbar-track-yellow-100 scrollbar-thumb-yellow-400"
      >
        {weather?.data?.hour?.map((h, index) => (
          <Parallax speed={2} key={index}>
            <div className="relative transition-all duration-150 hover:scale-105">
              <div className=" hover:shadow-off relative my-2 mx-4 h-72 min-h-fit w-[45vw] animate-customDown rounded-lg bg-white bg-opacity-40 px-5 py-3 shadow-lg drop-shadow-xl hover:ring-2 hover:ring-yellow-400 sm:w-48">
                <div className="flex h-full w-full flex-col items-center justify-center text-white">
                  <div className="flex items-center text-sm text-white">
                    <AiOutlineClockCircle className="mr-2 pb-[1px] text-xs" />
                    <p>{h.time.split(' ')[1]}</p>
                  </div>
                  <Image
                    src={`/assets/weather/${h.icon}`}
                    width={70}
                    height={70}
                    alt={'weather icon'}
                  />

                  <div className="flex h-2/3 flex-col items-center justify-center">
                    <h2 className="text-center text-base text-white md:text-lg">
                      {h.condition}
                    </h2>
                    <p className="text-xs text-gray-700">
                      <b>{h.temp_c}&#176;C</b> / <b>{h.temp_f}&#176;F</b>
                    </p>
                    <div className="text-justify text-sm leading-5 text-white">
                      {h.chance_of_rain > 60 ? (
                        <p>
                          There are <i>{h.chance_of_rain}%</i> chance of
                          raining! Don&apos;t forget to bring your umbrella ☔
                        </p>
                      ) : h.chance_of_rain < 40 ? (
                        <p>
                          There are <i>{h.chance_of_rain}%</i> chance of
                          raining. It&apos;s good to go out 😎
                        </p>
                      ) : (
                        <p>
                          There are <i>{h.chance_of_rain}%</i> chance of
                          raining!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Parallax>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetail;
