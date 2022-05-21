import type { ReactNode } from 'react';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  return (
    <div className="w-full text-gray-700 antialiased">
      {props.meta}
      <div className="relative h-screen w-full">
        <div
          className="fixed inset-0 scale-105 bg-cover bg-bottom bg-no-repeat blur-md brightness-[.85]"
          style={{ backgroundImage: 'url(/assets/images/background.svg)' }}
        ></div>
        {props.children}
      </div>
    </div>
  );
};

export { Main };
