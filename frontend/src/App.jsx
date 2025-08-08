import { useState } from "react";

const SYMBOLS = ['C', 'L', 'O', 'W'];

function App() {
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState(""); // просто password, без hash на фронті
  const [loading, setLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true); // true = логін, false = реєстрація

  const [symbols, setSymbols] = useState(['X', 'X', 'X']);
  const [spinning, setSpinning] = useState(false);
  const [score, setScore] = useState(0);

  const handleAuth = async (e) => {
  e.preventDefault();
  setLoading(true);

  const url = isLogin ? 'http://localhost:8989/api/auth/login' : 'http://localhost:8989/api/auth/registration';

  const body = isLogin
    ? { email, passwordHash } // логін - відправляєш поле passwordHash
    : { email, password: passwordHash }; // реєстрація - відправляєш поле password

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(isLogin ? 'Login failed' : 'Registration failed');

    const data = await res.json();
    setUser(data);
    setScore(data.score || 0);
    setLoading(false);
  } catch (err) {
    alert(err.message);
    setLoading(false);
  }
};
  const spin = async () => {
    if (score <= 0) {
      alert("Not enough credits");
      return;
    }

    setSpinning(true);

    let intervals = [];

    for (let i = 0; i < 3; i++) {
      intervals[i] = setInterval(() => {
        setSymbols(prev => {
          const updated = [...prev];
          updated[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return updated;
        });
      }, 100);
    }
    /*
    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Spin failed');

      const data = await response.json();

      setSymbols(data.symbols);
      setScore(prev => prev + data.score);
    } catch (error) {
      alert('Error during spin: ' + error.message);
    }
    */

    setTimeout(() => clearInterval(intervals[0]), 1000);
    setTimeout(() => clearInterval(intervals[1]), 2000);
    setTimeout(() => {
      clearInterval(intervals[2]);
      setSpinning(false);
    }, 3000);
  };

  // Кешаут
  const Cashout = async () => {
    try {
      const response = await fetch('http://localhost:8989/api/users/:id/cashout', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  }),
      });

      if (!response.ok) throw new Error('Cashout failed');

      const data = await response.json();

      alert(`You cashed out with ${data.score} credits!`);
      setScore(0);
      setSymbols(['X', 'X', 'X']);
    } catch (error) {
      alert('Error during cashout: ' + error.message);
    }
  };
  // (тут твій код spin і Cashout залишається без змін)

  if (!user) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleAuth}>
          <label className="block mb-2 font-semibold" htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="your@example.com"
          />

          <label className="block mb-2 font-semibold" htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={passwordHash}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-6 border rounded"
            placeholder="********"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Register")}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    );
  }

  // Якщо залогінений — показати гру
  return (
    <div className="text-center mt-10 max-w-md mx-auto">
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

