import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import itemRoutes from "./routes/items.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/orders.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/items", itemRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("App is running");
});

const connectionUrl =
  "mongodb+srv://luki752:luki752123@cluster0.r7chc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(connectionUrl)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running o port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
