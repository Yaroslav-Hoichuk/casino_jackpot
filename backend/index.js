import express from "express"; 
import mongoose from "mongoose";

const app = express();
const PORT = 8989;

app.use(express.json());

mongoose.connect("mongodb+srv://admin1:admin@cluster0.oceaqdv.mongodb.net/")
  .then(() => console.log("BD is available"))
  .catch((err) => {
    console.log(err);
  });





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});