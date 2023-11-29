import { useEffect, useState } from "react";
import { SearchResults } from "./types";

const ACCESS_KEY: string = import.meta.env.VITE_APP_ACCESS_KEY;

function App(): JSX.Element {
  const [search, setSearch] = useState<string>("Random");
  const [data, setData] = useState<SearchResults[] | undefined>([]);
  const [page, setPage] = useState<number>(1);

  const getResults = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos/?client_id=${ACCESS_KEY}&query=${search}&page=${page}&per_page=9`
      );
      const { results } = await response.json();
      setData(results);
      if (!response.ok) throw new Error("Network response was not ok");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    getResults();
  }, [page]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.length === 0) return;
    getResults();
  };

  const handleClickNext = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleClickPrev = () => {
    setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="page">
      <header>
        <h1>Buscador de Imagenes</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            onChange={handleChange}
            type="text"
            name="query"
            value={search}
            placeholder="Gato, perro, avión..."
          />
          <button type="submit">Buscar</button>
        </form>
      </header>
      <main>
        <ul>
          {data?.map((result) => (
            <li key={result.id}>
              <img src={result.urls.small} alt={result.description || ""} />
              <div className="desc-box">
                {/* <h2>{result.description}</h2>
                <p className="description">{result.alt_description}</p> */}
              </div>
            </li>
          ))}
        </ul>
        {data?.length === 0 ? (
          ""
        ) : (
          <div className="result-page">
            <button
              disabled={data?.length === 1}
              onClick={handleClickPrev}
              className="more-button"
            >
              Prev
            </button>
            <span>{page}</span>
            <button onClick={handleClickNext} className="more-button">
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
