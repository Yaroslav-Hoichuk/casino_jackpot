// components/AuthForm.jsx
export default function AuthForm({
  isLogin,
  setIsLogin,
  handleAuth,
  loading,
  email,
  setEmail,
  password,
  setPassword
}) {
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
          value={password}
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
