import express from "express";
import router from "./routes.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();
/* Set Up */

// FIXME: Change name
const url = "mongodb://localhost:27017/CryptoTrade";
mongoose
  .connect(url)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(`DB is not connected ${err} :(`));

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
  })
);
app.set("views", "src/views");
app.set("view engine", "hbs");

/* Static files */
app.use("/static", express.static("src/public"));
/* Body parser */
app.use(express.urlencoded({ extended: false }));

/* cookie parser */
app.use(cookieParser());
app.use(authMiddleware);
app.use(router);

app.listen(3000, () => console.log("Server is listening on port 3000"));
