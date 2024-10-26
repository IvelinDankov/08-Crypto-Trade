import { Router } from "express";
import cryptoService from "../services/cryptoService.js";

const router = Router();

router.get("/", async (req, res) => {
  const coins = await cryptoService.getAll().lean();
  if (coins.length > 3) {
    coins.length = 3
  }
  res.render("home", { title: "Home Page - Crypto Web", coins });
});

export default router;
