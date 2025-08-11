export const cashout = async () => {
    try {
      const res = await axios.put(`http://localhost:8989/api/users/${user._id}/cashout`, 
        {},{
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!res.ok) throw new Error('Cashout failed');

      alert(`You cashed out all credits!`);

      setScore(0);
      setSymbols(['X', 'X', 'X']);

    } catch (err) {
        console.log(err);
    }
  };