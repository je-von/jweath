import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillStar, AiOutlineSearch, AiOutlineStar } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { Parallax } from 'react-scroll-parallax';
import useSWR from 'swr';

import { Meta } from '@/layouts/Meta';
import { fetcher } from '@/lib/fetcher';
import { Main } from '@/templates/Main';

const Index = () => {
  const [favorites, setFavorites] = useState([]);
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
        setLimit((prev) => prev + 2);
      }
    });

    observer.observe(searchResultRef.current);
    // observer.observe()
  }, []);
  useEffect(() => {
    if (favorites.length < 1) {
      const temp = localStorage.getItem('favorites-location-jweath');
      if (temp) setFavorites(temp.split(',') as any);
    } else {
      localStorage.setItem('favorites-location-jweath', favorites.toString());
    }
  }, [favorites]);

  const content = (child) => (
    <Main
      meta={
        <Meta
          title="jweath | Weather App by Jevon"
          description="A web application to get updated weather from all places in the world."
        />
      }
    >
      <div
        id="search"
        className={`px-5 pt-64 pb-12 min-h-[120vh] flex flex-col items-center justify-center w-full`}
      >
        <Parallax speed={6} className="w-full">
          <div className="w-full">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-300">
                <AiOutlineSearch />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full text-ellipsis rounded-lg border border-gray-300 bg-transparent p-4 pl-10 text-sm text-white shadow-2xl drop-shadow-2xl placeholder:text-white focus:border-blue-500 focus:ring-blue-500 "
                placeholder="search city, coordinates, postal code, or anything..."
                onChange={(e) => {
                  e.preventDefault();
                  const search = e.target.value;
                  if (search) {
                    if (search.startsWith('*')) {
                      setLocation(`&multi=${favorites.toString()}`);
                    } else {
                      setLocation(e.target.value);
                    }
                  } else {
                    setResetSearch(true);
                  }
                }}
              />
            </div>
          </div>
        </Parallax>
        <Parallax className="w-full" speed={4}>
          <div className="mt-2 flex items-center justify-center text-center text-xs text-gray-300 drop-shadow-lg ">
            <BsInfoCircle className="mr-2 text-[1rem]" />
            <div className="flex max-w-[60%] flex-wrap items-center whitespace-nowrap leading-4">
              tips: type
              <p
                className="mx-2 cursor-pointer hover:scale-[1.15]"
                onClick={() => {
                  const searchBar = document.getElementById(
                    'default-search'
                  ) as HTMLInputElement;
                  if (searchBar) searchBar.value = '*';
                  setLocation(`&multi=${favorites.toString()}`);
                }}
              >
                &apos;*&apos;
              </p>
              to show your starred cities
            </div>
          </div>
        </Parallax>
        <div className="mt-5 flex flex-wrap items-center justify-center ">
          {child}
        </div>
        <div ref={searchResultRef}></div>
      </div>
    </Main>
  );
  if (isValidating && !weathers) {
    return content(null);
  }
  return content(
    weathers?.data?.slice(0, limit).map((w, index) => (
      <Parallax speed={2} key={index}>
        <div className="hover:shadow-off my-2 mx-4 h-44 min-h-fit w-[80vw] animate-customDown rounded-lg bg-white bg-opacity-40 px-5 py-3 shadow-lg drop-shadow-xl hover:scale-105 hover:ring-2 hover:ring-yellow-400 md:w-[21rem]">
          <div className="flex h-full w-full flex-col items-center justify-center text-black">
            <div className="flex w-full items-center justify-between">
              <div className="w-3/4">
                <h2 className="text-black">{w.name}</h2>
                <p className="my-1 text-gray-700">{w.country}</p>
              </div>
              <Image
                src={`/assets/weather/${w.icon}`}
                width={50}
                height={50}
                alt={'weather icon'}
              />
            </div>
            <p className="text-justify leading-5 text-black">
              It&apos;s <i>{w.condition}</i> and feels like{' '}
              <b>{w.feelslike}&#176;C</b>. It&apos;s actually{' '}
              <b>{w.temperature}&#176;C</b>.
            </p>
            <div className="bottom-0 mt-auto flex w-full flex-row-reverse">
              <div
                className="cursor-pointer text-gray-700 hover:scale-125"
                onClick={() => {
                  if (favorites.includes(w.url as never)) {
                    setFavorites(favorites.filter((f) => f !== w.url));
                  } else {
                    setFavorites((prev) => prev.concat(w.url));
                  }
                }}
              >
                {favorites.includes(w.url as never) ? (
                  <AiFillStar className="text-yellow-400" />
                ) : (
                  <AiOutlineStar />
                )}
              </div>
            </div>
          </div>
        </div>
      </Parallax>
    ))
  );
};

export default Index;
