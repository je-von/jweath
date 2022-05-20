import { useRouter } from 'next/router';

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
      <h3 className="h-screen">tes</h3>
    </Main>
  );
};

export default Index;
