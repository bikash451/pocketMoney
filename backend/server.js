import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-v1", routes);

app.get("/", (req, res) => {
  res.send("API Root OK");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
