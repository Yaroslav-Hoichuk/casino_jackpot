// components/Game.jsx
export default function Game({ email, credits, symbols, spin, spinning, cashout }) {
  return (
    <div className="text-center mt-10 max-w-md mx-auto">
      <p className="text-2xl font-semibold">User {email} Credits: {credits}</p>

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
          onClick={cashout}
        >
          Cashout
        </button>
      </div>
    </div>
  );
}
