import { Button } from "./button.jsx";

export default function Game({ credits, symbols, spin, spinning, cashout }) {
  return (
    <div className="text-center mt-10 max-w-md mx-auto">
      <p className="text-2xl font-semibold">Credits: {credits}</p>

      <div className="flex justify-center gap-9 text-6xl font-bold my-6">
        {symbols.map((symbol, id) => (
          <div key={id}>{symbol}</div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button action = {spin}  spinning = {spinning} text = {"Spin"}/>
        <Button action = {cashout}  text = "Cashout"/>

      </div>
    </div>
  );
}
