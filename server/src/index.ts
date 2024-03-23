import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";

const app: Application = express();

const port: number = 5000 || process.env.PORT;

dotenv.config();

console.log(process.env.NODE_ENV);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

routes(app);

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
