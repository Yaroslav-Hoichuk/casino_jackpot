import axios from "axios";
import {SYMBOLS} from "../constants/symbols.js"

export const spinAmination = async(setSymbols, setScore,setSpinning)=>{
  setSpinning(true);
  
  let intervals = [];
  let result;
  for (let i = 0; i < 3; i++) {
    intervals[i] = setInterval(() => {
      setSymbols(prev => {
        const updated = [...prev];
        updated[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        return updated;
      });
    }, 100);
  }
  try {
    result = await axios.post('http://localhost:8989/api/users/:id/spin', 
      {},{
          withCredentials: true,
        });
  } catch (error) {
    intervals.forEach(id => clearInterval(id));
    setSpinning(false);
    console.error("spin failed", error)
    return;
  }

  const delays = [1000,2000,3000];
  const stopPromises = delays.map((delay,i)=>{
    new Promise(resolve=> {
          stopSpin(intervals, result, i, setSymbols, delay)
          resolve();
        },delay)
    })

  
  await Promise.all(stopPromises);

  setScore(result.data.credits);
  setTimeout(()=>setSpinning(false),3000)


}

const stopSpin = (intervals, result, i, setSymbols, delay)=>{
  setTimeout(() => {
    clearInterval(intervals[i]);
    setSymbols(prev => {
      const updated = [...prev];
      updated[i] = result.data.result[i];
      return updated;
      })
  },delay)
}
