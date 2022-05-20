import Image from 'next/image';
import { useRouter } from 'next/router';
import { AiOutlineSearch } from 'react-icons/ai';
import { Parallax } from 'react-scroll-parallax';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const router = useRouter();

  return (
    <Main
      meta={
        <Meta
          title="jweath | Weather App"
          description="A web application to get updated weather from all places in the world."
        />
      }
    >
      <div className="py-64 px-5">
        <form>
          <label
            htmlFor="default-search"
            className="sr-only mb-2 text-sm font-medium text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
              <AiOutlineSearch />
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full text-ellipsis rounded-lg border border-gray-300 bg-transparent p-4 pl-10 text-sm text-white placeholder-white shadow-2xl drop-shadow-2xl focus:border-blue-500 focus:ring-blue-500 "
              placeholder="Search city, coordinates, postal code, anything..."
              required
            />
          </div>
        </form>
        <div className="mt-5 flex flex-wrap items-center justify-center">
          <Parallax speed={2}>
            <div className=" m-2 w-[80vw] rounded-lg bg-white bg-opacity-50 px-5 py-2 drop-shadow-lg md:w-[21rem]">
              <div className="flex w-full flex-col text-black">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-black">Jakarta, Jakarta Raya</h2>
                    <p className="my-1 text-gray-700">Indonesia</p>
                  </div>

                  <Image
                    className="hover:scale-125 "
                    src={'/assets/weather/day/356.png'}
                    width={40}
                    height={40}
                    alt={'weather icon'}
                  />
                </div>
                <p className="text-justify leading-5 text-black">
                  It&apos;s <i>raining</i> and feels like <b>30&#176;C</b>.
                  It&apos;s actually <b>35&#176;C</b>.
                </p>
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    </Main>
  );
};

export default Index;
