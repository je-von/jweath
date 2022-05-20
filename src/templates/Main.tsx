import Image from 'next/image';
import type { ReactNode } from 'react';
import { Parallax } from 'react-scroll-parallax';
import Typical from 'react-typical';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full text-gray-700 antialiased">
    {props.meta}
    <div className="relative h-screen w-full">
      <div
        className="fixed inset-0 scale-105 bg-cover bg-bottom bg-no-repeat blur-md"
        style={{ backgroundImage: 'url(/assets/images/background.svg)' }}
      ></div>
      <div className="container relative mx-auto flex h-full max-w-screen-md flex-col items-center justify-center px-5">
        <Parallax speed={10}>
          <h1 className="font-ubuntu text-6xl font-bold text-white drop-shadow-lg">
            jweath
          </h1>
        </Parallax>
        <div className="my-6 w-[80vw] bg-black px-2 sm:w-[24vw]">
          <Typical
            steps={[
              'get updated weather realtime..',
              2000,
              'scroll to view places near you..',
              1000,
            ]}
            loop={Infinity}
            wrapper="p"
          />
        </div>
        <Parallax speed={-5}>
          <div className="w-[80vw] rounded-lg border px-5 py-2 drop-shadow-lg sm:w-[23vw]">
            <div className="flex items-center justify-between">
              <Image
                className="hover:scale-125"
                src={'/assets/weather/day/356.png'}
                width={55}
                height={55}
                alt={'weather icon'}
              />
              <div className="flex flex-col text-white">
                <p className="text-white">Look outside! </p>
                <p className="text-white">
                  It&apos;s <i>raining</i> and 30&#176;C
                </p>
              </div>
            </div>
          </div>
        </Parallax>
      </div>
      <div className="relative z-50 mx-auto max-w-screen-md">
        {props.children}
      </div>
    </div>
  </div>
);

export { Main };
