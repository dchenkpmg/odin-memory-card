import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [clicked, setClicked] = useState(new Set());

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
        setCards(shuffleGame(allPokemon));
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

  function shuffleGame(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
  }

  const handleReset = () => {
    setCards(shuffleGame(cards));
  };

  const handleClick = (e) => {
    
  };

  return (
    <>
      <title>Memory Game</title>
      <header>
        <h1>Memory Game</h1>
      </header>
      <main>
        <div className="scores">
          <p>Score: {score}</p>
          <p>Max Score: {maxScore}</p>
        </div>
        <div className="messages">
          {loading && <p>Loading Pokemon...</p>}
          {error && <p>{error}</p>}
        </div>
        <div className="card-grid">
          {cards.map((pokemon, index) => (
            <button key={index} className="card">
              <img
                src={pokemon.sprites.front_default}
                alt="pokemon sprite"
              ></img>
              <p>{pokemon.name}</p>
            </button>
          ))}
        </div>
        <div className="reset-div">
          <button className="reset-btn" onClick={handleReset}>
            Reset Game
          </button>
        </div>
      </main>
    </>
  );
}

export default App;
