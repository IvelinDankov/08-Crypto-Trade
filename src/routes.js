import { Router } from "express";
import homeController from "./controllers/homeController.js";
import authController from "./controllers/authController.js";
import cryptoController from './controllers/cryptoController.js';
const router = Router();

router.use("/", homeController);
router.use("/auth", authController);
router.use('/crypto', cryptoController);
router.use("*", (req, res) => {
  res.render("home/404", { title: "404 Page" });
});

export default router;
