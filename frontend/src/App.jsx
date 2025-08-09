import { useState } from "react";
import AuthForm from "./AuthForm.jsx";
import Game from "./Game.jsx";

const SYMBOLS = ['C', 'L', 'O', 'W'];

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [symbols, setSymbols] = useState(['X', 'X', 'X']);
  const [spinning, setSpinning] = useState(false);
  const [score, setScore] = useState();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isLogin
      ? 'http://localhost:8989/api/auth/login'
      : 'http://localhost:8989/api/auth/registration';
    const body = isLogin
      ? { email, passwordHash }
      : { email, password: passwordHash };

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
      setScore(data.score || 10);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

const spin = async () => {
  if (score <= 0) {
    alert("Not enough credits");
    return;
  }

  setSpinning(true);

  // 1. Запускаємо анімацію випадкових символів
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

  // 2. Паралельно запитуємо результат з сервера
  const response = await fetch('http://localhost:8989/api/users/:id/spin', {
    method: 'POST',
    credentials: 'include',
  });
  const result = await response.json();

  // 3. Поступово зупиняємо барабани та вставляємо фінальний результат
  setTimeout(() => {
    clearInterval(intervals[0]);
    setSymbols(prev => {
      const updated = [...prev];
      updated[0] = result.result[0];
      return updated;
    });
  }, 1000);

  setTimeout(() => {
    clearInterval(intervals[1]);
    setSymbols(prev => {
      const updated = [...prev];
      updated[1] = result.result[1];
      return updated;
    });
  }, 2000);

  setTimeout(() => {
    clearInterval(intervals[2]);
    setSymbols(prev => {
      const updated = [...prev];
      updated[2] = result.result[2];
      return updated;
    });
    setSpinning(false);
    setScore(result.credits); // оновлюємо кредити
  }, 3000);
};


  const cashout = async () => {
    try {
      const res = await fetch(`http://localhost:8989/api/users/${user._id}/cashout`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Cashout failed');
      const data = await res.json();
      alert(`You cashed out with ${data.score} credits!`);
      setScore(0);
      setSymbols(['X', 'X', 'X']);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) {
    return (
      <AuthForm
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleAuth={handleAuth}
        loading={loading}
        email={email}
        setEmail={setEmail}
        password={passwordHash}
        setPassword={setPassword}
      />
    );
  }

  return (
    <Game
      email={email}
      credits={score}
      symbols={symbols}
      spin={spin}
      spinning={spinning}
      cashout={cashout}
    />
  );
}

export default App;
