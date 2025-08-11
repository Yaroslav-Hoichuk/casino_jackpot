import axios from "axios";

export const checkAuth = async (setUser,setScore) => {
    try {
      const res = await axios.get("http://localhost:8989/api/auth/me",
        {
          withCredentials: true,
        }
      );

      if (!res.data.ok) {
        setUser(null);
      } else {
        setUser(res.data.user);
        setScore(res.data.user.creditScore);
      }
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };
