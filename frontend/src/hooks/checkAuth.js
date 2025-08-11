import axios from "axios";

export const checkAuth = async (setUser,setScore) => {
    try {
      const res = await axios.get("http://localhost:8989/api/auth/me",
        {
          withCredentials: true,
        }
      );

    if (res.data?.user) {
      setUser(res.data.user);
      setScore(res.data.user.creditScore);
    } else {
      setUser(null);
}

    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };
