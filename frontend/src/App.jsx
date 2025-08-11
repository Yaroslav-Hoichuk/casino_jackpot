import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm.jsx";
import Game from "./components/Game.jsx";
import { checkScore } from "./utils/checkScore.js";
import { spinAmination } from "./utils/spinAnitamation.js";
import { checkAuth } from "./hooks/checkAuth.js";
import { cashout } from "./utils/cashout.js";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [passwordHash, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [symbols, setSymbols] = useState(['X', 'X', 'X']);
  const [spinning, setSpinning] = useState(false);
  const [score, setScore] = useState();

  useEffect(() => {
    checkAuth(setUser, setScore);
  
  }, []);

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
      const res = await axios.post(url, body, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status !== 200) {
        throw new Error(isLogin ? 'Login failed' : 'Registration failed');
      }

      const data = res.data;

      setUser(data.user);
      setScore(data.user.creditScore);
    } catch (err) {
      alert(err.message || 'Error during authentication');
    } finally {
      setLoading(false);
    }
};

const spin = async () => {
  
  checkScore(score);
  spinAmination(setSymbols, setScore,setSpinning);
  
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
      credits={score}
      symbols={symbols}
      spin={spin}
      spinning={spinning}
      cashout={cashout}
    />
  );
}

export default App;
