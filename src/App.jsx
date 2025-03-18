import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=8"
        );
        if (!response.ok) {
          throw new Error(`HTTP error: Status ${response.status}`);
        }
        let data = await response.json();

        const pokemon = data.results.map(async (pokemon) => {
          const pokeResponse = await fetch(pokemon.url);
          if (!pokeResponse.ok) {
            throw new Error(`HTTP error: Status ${pokeResponse.status}`);
          }
          return pokeResponse.json();
        });

        const allPokemon = await Promise.all(pokemon);
        setCards(allPokemon);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCards(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  console.log(cards);

  return (
    <>
      <title>Memory Game</title>
      <header>
        <h1>Memory Game</h1>
      </header>
      <main>
        <div className="card-grid">
          {loading && <p>Loading Pokemon...</p>}
          {error && <p>{error}</p>}
        </div>
      </main>
    </>
  );
}

export default App;
