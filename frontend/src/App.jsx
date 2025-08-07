import { useState } from "react";

const SYMBOLS = ['C', 'L', 'O', 'W'];

function App() {
  const [symbols, setSymbols] = useState(['X', 'X', 'X']);
  const [spinning, setSpinning] = useState(false);
  const [score, setScore] = useState(10);

  const spin = async () => {
    if (score <= 0) {
      alert("Not enough credits");
      return;
    }

    setSpinning(true);

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Spin failed');
      }

      const data = await response.json();

      // Очікуємо, що бекенд повертає:
      // { symbols: ['C', 'L', 'O'], score: 15 }
      setSymbols(data.symbols);
      setScore(data.score);
    } catch (error) {
      alert('Error during spin: ' + error.message);
    }

    setSpinning(false);
  };

  const Cashout = async () => {
    try {
      const response = await fetch('/api/cashout', { method: 'POST' });

      if (!response.ok) throw new Error('Cashout failed');

      const data = await response.json();

      alert(`You cashed out with ${data.score} credits!`);
      setScore(0);
      setSymbols(['X', 'X', 'X']);
    } catch (error) {
      alert('Error during cashout: ' + error.message);
    }
  };

  return (
    <div className="text-center mt-10">
      <div>
        <p id="credit-score" className="text-2xl font-semibold">Credits: {score}</p>
      </div>

      <div className="flex justify-center gap-9 text-6xl font-bold my-6">
        {symbols.map((symbol, id) => (
          <div key={id}>{symbol}</div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          onClick={spin}
          disabled={spinning}
        >
          Spin
        </button>
        <button
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          onClick={Cashout}
        >
          Cashout
        </button>
      </div>
    </div>
  );
}

export default App;
