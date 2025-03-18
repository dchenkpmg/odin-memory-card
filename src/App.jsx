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

  function shuffleGame(array) {
    array.sort(() => Math.random() - 0.5);
    return array;
  }

  const handleReset = () => {
    setCards(shuffleGame(cards));
    setScore(0);
    setMaxScore(0);
  };

  const handleClick = (id) => {
    if (clicked.has(id)) {
      setScore(0);
      setClicked(new Set());
    } else {
      const newClickedCards = new Set(clicked);
      newClickedCards.add(id);
      setClicked(newClickedCards);
      setScore(score + 1);
      if (score + 1 > maxScore) {
        setMaxScore(score + 1);
      }
    }
    setCards(shuffleGame([...cards]));
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
          {cards.map((pokemon) => (
            <button
              key={pokemon.id}
              className="card"
              onClick={() => handleClick(pokemon.id)}
            >
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
