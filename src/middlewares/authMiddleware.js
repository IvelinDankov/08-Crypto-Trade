import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies["auth"];

  if (!token) {
    return next();
  }

  // validate token

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    req.user = decodedToken;
    req.isAuthenticated = true;
    res.locals.user = decodedToken;
    res.locals.isAuthenticated = true;

    next();
  } catch (err) {
    // const error = getErrorMsg(err)
    res.clearCookie("auth");
    res.redirect("/auth/login");
  }
}

export function isAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("auth/login");
  }

  next();
}

export function isGuest(req, res, next) {
  if (req.user) {
    return res.redirect("/404");
  }

  next();
}
