import { Router } from "express";
import authService from "../services/authService.js";
import { getErrorMsg } from "../utils/errorUtil.js";

const router = Router();

/* ######################
REGISTER
######################### */
router.get("/register", (req, res) => {
  res.render("auth/register", { tittle: "Register Page - Crypto Web" });
});

router.post("/register", async (req, res) => {
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

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login Page - Crypto Web" });
});
router.post("/login", async (req, res) => {
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

router.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

export default router;
