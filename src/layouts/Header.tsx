import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import { VscLocation } from 'react-icons/vsc';
import Clock from 'react-live-clock';
import { Parallax } from 'react-scroll-parallax';
import Typical from 'react-typical';
import useSWR from 'swr';

import { fetcher } from '@/lib/fetcher';

const Header = () => {
  const [location, setLocation] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((p) => {
      setLocation(`${p.coords.latitude},${p.coords.longitude}`);
    });
  }, []);

  // eslint-disable-next-line react/display-name
  const TypingAnimation = memo(
    () => {
      return (
        <Typical
          loop={Infinity}
          steps={[
            'get updated weather from places around the world🌏',
            2000,
            'get updated weather in realtime⏳',
            1000,
          ]}
        />
      );
    },
    () => true
  );

  const { data: weather, isValidating } = useSWR<any>(
    `/api/weather?location=${location}&top=true`,
    fetcher
  );
  const content = (child) => (
    <div className="container relative mx-auto flex h-full max-w-screen-md flex-col items-center justify-center px-5">
      <Parallax speed={11}>
        <h1 className="font-ubuntu text-6xl font-bold text-white drop-shadow-lg">
          jweath
        </h1>
      </Parallax>
      <Parallax speed={5}>
        <div className="my-6 w-[80vw] bg-black bg-opacity-70 px-2 text-center sm:w-[34rem]">
          <TypingAnimation />
        </div>
      </Parallax>

      <Parallax speed={-2} scale={[1, 0.8]} translateY={[-10, 20]}>
        <div className="mb-7 w-[80vw] rounded-lg border px-5 py-2 shadow-2xl drop-shadow-2xl sm:w-[18rem]">
          {child}
        </div>
      </Parallax>
      <Parallax speed={-5}>
        <Clock
          format={'HH:mm:ss'}
          ticking={true}
          className="text-white drop-shadow-lg "
        />
        {/* <p>start searching</p> */}
      </Parallax>
    </div>
  );

  if (isValidating && !weather && location) {
    return content(
      <div className="flex items-center justify-between text-white">
        <VscLocation className="mr-2 w-1/5 text-4xl" />
        Loading...
      </div>
    );
  }

  return content(
    weather && weather.data ? (
      <div className="flex items-center justify-around">
        <Parallax speed={-0.5} rotateY={[360, 0]}>
          <Image
            className="hover:scale-125"
            src={`/assets/weather/${weather?.data?.icon}`}
            width={55}
            height={55}
            alt={'weather icon'}
          />
        </Parallax>

        <div className="ml-2 flex w-3/4 flex-col text-white">
          <p className="text-white">Look outside! </p>
          <p className="whitespace-normal text-white sm:whitespace-nowrap">
            It&apos;s {weather?.data?.temperature}&#176;C and{' '}
            <i className="whitespace-pre-wrap break-words">
              {weather?.data?.condition}
            </i>
          </p>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between text-white">
        <VscLocation className="mr-2 w-1/5 text-4xl" />
        Allow location access for best experience!
      </div>
    )
  );
};

export { Header };
