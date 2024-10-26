import { Router } from "express";
import cryptoService from "../services/cryptoService.js";
import { getErrorMsg } from "../utils/errorUtil.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/* ####################
######### CATALOG #######
##################### */

router.get("/catalog", async (req, res) => {
  const coins = await cryptoService.getAll().lean();

  res.render("crypto/catalog", { title: "Trade Catalog", coins });
});

/* ####################
######### CREATE #######
##################### */
router.get("/create", isAuth, (req, res) => {
  const selectedData = getSelectDataFields({});
  res.render("crypto/create", { title: "Create Page", payments: selectedData });
});

router.post("/create", isAuth, async (req, res) => {
  const cryptoData = req.body;
  const userId = req.user._id;

  try {
    await cryptoService.create(cryptoData, userId);
    res.redirect("/crypto/catalog");
  } catch (err) {
    const selectedData = getSelectDataFields(cryptoData);
    const error = getErrorMsg(err);
    res.render("crypto/create", {
      payments: selectedData,
      title: "Create Page",
      crypto: cryptoData,
      error,
    });
  }
});
/* ####################
######### SEARCH #######
##################### */

router.get("/search", async (req, res) => {
  const filter = req.query;

  try {
    const cryptos = await cryptoService.getAll(filter).lean();
    const selectedData = getSelectDataFields(filter);
    res.render("crypto/search", {
      title: "Search",
      cryptos,
      payments: selectedData,
      filter,
    });
  } catch (err) {
    // TODO: ERR
  }
});

/* ####################
######### DETAILS #######
##################### */
router.get("/:cryptoId/details", async (req, res) => {
  const cryptoId = req.params.cryptoId;

  try {
    const coin = await cryptoService.getOne(cryptoId).lean();

    const isOwner = coin.owner == req.user?._id;

    //   FIXME: Buy
    const bought = coin.buyCrypto.some((userId) => userId == req.user?._id);
    res.render("crypto/details", {
      title: "Details Page",
      coin,
      isOwner,
      bought,
    });
  } catch (err) {
    //   TODO: Error Handling
  }
});

/* ####################
######### BUY #######
##################### */

router.get("/:cryptoId/buy", isAuth, async (req, res) => {
  const cryptoId = req.params.cryptoId;
  const userId = req.user._id;
  const crypto = await cryptoService.getOne(cryptoId);

  const isOwner = crypto.owner.toString() === userId;

  if (isOwner) {
    return res.redirect("/404");
  }

  try {
    await cryptoService.buy(cryptoId, userId);
    res.redirect(`/crypto/${cryptoId}/details`);
  } catch (err) {
    console.log(err.message);
  }
});

/* ####################
######### DELETE #######
##################### */

router.get("/:cryptoId/delete", isAuth, async (req, res) => {
  const cryptoId = req.params.cryptoId;
  const userId = req.user._id;

  const isOwner = await isCryptoOwner(cryptoId, userId);

  if (!isOwner) {
    return res.redirect("/404");
  }

  await cryptoService.remove(cryptoId);

  res.redirect("/crypto/catalog");
});

/* ####################
######### EDIT #######
##################### */

router.get("/:cryptoId/edit", isAuth, async (req, res) => {
  const cryptoId = req.params.cryptoId;
  const userId = req.params._id;

  const isOwner = await isCryptoOwner(cryptoId, userId);

  if (!isOwner) {
    res.redirect("/404");
  }

  try {
    const crypto = await cryptoService.getOne(cryptoId).lean();

    const selectedData = getSelectDataFields({});

    res.render("crypto/edit", {
      title: "Edit Page",
      crypto,
      payments: selectedData,
    });
  } catch (err) {
    const error = getErrorMsg(err);
    res.render("crypto/edit", {
      title: "Edit Page",
      crypto,
      payments: selectedData,
      error,
    });
  }
});

router.post("/:cryptoId/edit", isAuth, async (req, res) => {
  const cryptoId = req.params.cryptoId;
  const cryptoData = req.body;

  try {
    await cryptoService.edit(cryptoId, cryptoData);

    res.redirect(`/crypto/${cryptoId}/details`);
  } catch (err) {
    const error = getErrorMsg(err);
    const crypto = await cryptoService.getOne(cryptoId).lean();

    const optionData = getSelectDataFields(cryptoData);

    res.render("crypto/edit", {
      title: "Edit Page",
      error,
      crypto,
      payments: optionData,
    });
  }
});

/* ####################
######### HELPERS #######
##################### */
function getSelectDataFields(cryptoData) {
  const cryptoValues = ["crypto-wallet", "credit-card", "debit-card", "paypal"];

  const cryptoOptionsView = cryptoValues.map((type) => ({
    value: type,
    label: type,
    selected: cryptoData.payment === type ? "selected" : "",
  }));

  return cryptoOptionsView;
}

async function isCryptoOwner(cryptoId, userId) {
  const crypto = await cryptoService.getOne(cryptoId);

  const isOwner = crypto.owner.toString() === userId;

  return isOwner;
}

export default router;
