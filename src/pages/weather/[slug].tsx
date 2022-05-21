import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaAngleLeft } from 'react-icons/fa';
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
    <div className="relative z-50 mx-auto my-10 max-w-[800px]">
      <Link href={'/#search'} passHref>
        <FaAngleLeft className="mt-16 mb-10 cursor-pointer text-2xl text-white drop-shadow-xl" />
      </Link>
      {child}
    </div>
  );

  if (isValidating && !weather) return content(null);
  console.log(weather);

  return content(
    <>
      <div className="flex w-full items-center justify-between">
        <div className="w-3/4">
          <h2 className="text-black">{weather?.data?.name}</h2>
          <p className="my-1 text-gray-700">{weather?.data?.country}</p>
        </div>
        <Image
          src={`/assets/weather/${weather?.data?.icon}`}
          width={50}
          height={50}
          alt={'weather icon'}
        />
      </div>
      <p className="text-justify leading-5 text-black">
        It&apos;s <i>{weather?.data?.condition}</i> and feels like{' '}
        <b>{weather?.data?.feelslike}&#176;C</b>. It&apos;s actually{' '}
        <b>{weather?.data?.temperature}&#176;C</b>.
      </p>
    </>
  );
};

export default WeatherDetail;
