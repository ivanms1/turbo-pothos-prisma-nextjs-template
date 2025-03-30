import { useSearchArticlesQuery } from 'apollo-hooks';
import { Button } from 'ui';

function Home() {
  const { data } = useSearchArticlesQuery();

  return (
    <div>
      <h1>Web</h1>
      <div>
        {data?.articles?.results?.map((article) => (
          <p key={article.id}> {article.title}</p>
        ))}
      </div>
      <Button>Beep</Button>
    </div>
  );
}

export default Home;
