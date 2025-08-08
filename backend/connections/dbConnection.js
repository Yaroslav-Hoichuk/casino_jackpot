import mongoose from "mongoose";

export const dbConnection = url=>mongoose.connect(url)
  .then(() => console.log("BD is available"))
  .catch((err) => {
    console.log(err);
  });