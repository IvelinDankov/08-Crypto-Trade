import { Router } from "express";
import authService from "../services/authService.js";
import { getErrorMsg } from "../utils/errorUtil.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const router = Router();

/* ######################
REGISTER
######################### */
router.get("/register", isGuest, (req, res) => {
  res.render("auth/register", { tittle: "Register Page - Crypto Web" });
});

router.post("/register",  isGuest, async (req, res) => {
  const { username, email, password, rePass } = req.body;

  try {
    const token = await authService.register(username, email, password, rePass);

    res.cookie("auth", token, { httpOnly: true });
    res.redirect("/");
  } catch (err) {
    const error = getErrorMsg(err);
    res.render("auth/register", {
      tittle: "Register Page",
      username,
      email,
      error,
    });
  }
});

/* ######################
LOGIN
######################### */

router.get("/login", isGuest, (req, res) => {
  res.render("auth/login", { title: "Login Page - Crypto Web" });
});
router.post("/login", isGuest, async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    res.cookie("auth", token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
     const error = getErrorMsg(err);
    res.render("auth/login", { title: "Login Page", email, error });
  }
});

/* ######################
LOGOUT
######################### */

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

export default router;
