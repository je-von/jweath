import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Parallax } from 'react-scroll-parallax';
import useSWR from 'swr';

import { Meta } from '@/layouts/Meta';
import { fetcher } from '@/lib/fetcher';
import { Main } from '@/templates/Main';

const Index = () => {
  const [limit, setLimit] = useState(0);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState('Indonesia');
  const [resetSearch, setResetSearch] = useState(true);
  const { data: weathers, isValidating } = useSWR<any>(
    `/api/weather?location=${location}`,
    fetcher
  );
  useEffect(() => {
    if (resetSearch) {
      navigator.geolocation.getCurrentPosition((p) => {
        setLocation(`${p.coords.latitude},${p.coords.longitude}`);
      });
      setResetSearch(false);
    }
  }, [resetSearch]);
  useEffect(() => {
    if (!searchResultRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        console.log(limit);
        setLimit((prev) => prev + 2);
      }
    });

    observer.observe(searchResultRef.current);
  }, []);

  const content = (child) => (
    <Main
      meta={
        <Meta
          title="jweath | Weather App by Jevon"
          description="A web application to get updated weather from all places in the world."
        />
      }
    >
      <div className="px-5 pt-64 pb-12">
        <Parallax speed={5}>
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
                className="block w-full text-ellipsis rounded-lg border border-gray-300 bg-transparent p-4 pl-10 text-sm text-white shadow-2xl drop-shadow-2xl placeholder:text-white focus:border-blue-500 focus:ring-blue-500 "
                placeholder="Search city, coordinates, postal code, anything..."
                onChange={(e) => {
                  e.preventDefault();
                  const search = e.target.value;
                  if (search) {
                    setLocation(e.target.value);
                  } else {
                    setResetSearch(true);
                  }
                }}
              />
            </div>
          </form>
        </Parallax>
        <div className="mt-5 flex flex-wrap items-center justify-center ">
          {child}
        </div>
      </div>
      <div ref={searchResultRef}></div>
    </Main>
  );
  if (isValidating && !weathers) {
    return content(null);
  }
  return content(
    weathers?.data?.slice(0, limit).map((w, index) => (
      <Parallax speed={2} key={index}>
        <div className="m-2 h-44 min-h-fit w-[80vw] animate-customDown rounded-lg bg-white bg-opacity-40 px-5 py-2 shadow-lg drop-shadow-xl md:w-[21rem]">
          <div className="flex h-full w-full flex-col items-center justify-center text-black">
            <div className="flex w-full items-center justify-between">
              <div className="w-3/4">
                <h2 className="text-black">{w.name}</h2>
                <p className="my-1 text-gray-700">{w.country}</p>
              </div>
              <Parallax speed={-2}>
                <Image
                  src={`/assets/weather/${w.icon}`}
                  width={50}
                  height={50}
                  alt={'weather icon'}
                />
              </Parallax>
            </div>
            <p className="text-justify leading-5 text-black">
              It&apos;s <i>{w.condition}</i> and feels like{' '}
              <b>{w.feelslike}&#176;C</b>. It&apos;s actually{' '}
              <b>{w.temperature}&#176;C</b>.
            </p>
          </div>
        </div>
      </Parallax>
    ))
  );
};

export default Index;
