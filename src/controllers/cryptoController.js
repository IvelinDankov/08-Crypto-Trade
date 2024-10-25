import { Router } from "express";
import cryptoService from "../services/cryptoService.js";
import { getErrorMsg } from "../utils/errorUtil.js";

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
router.get("/create", (req, res) => {
  const cryptoData = req.body;
  const selectedData = getSelectDataFields(cryptoData);
  res.render("crypto/create", { title: "Create Page", payment: selectedData });
});

router.post("/create", async (req, res) => {
  const cryptoData = req.body;
  const userId = req.user._id;

  try {
    await cryptoService.create(cryptoData, userId);
    res.redirect("/crypto/catalog");
  } catch (err) {
    const error = getErrorMsg(err);
    const selectedData = getSelectDataFields(cryptoData);
    res.render("crypto/create", {
      title: "Create Page",
      crypto: cryptoData,
      payment: selectedData,
      error,
    });
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

router.get("/:cryptoId/buy", async (req, res) => {
  const cryptoId = req.params.cryptoId;
  const userId = req.user._id;

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

router.get("/:cryptoId/delete", async (req, res) => {
  const cryptoId = req.params.cryptoId;

  await cryptoService.remove(cryptoId);

  res.redirect("/crypto/catalog");
});

/* ####################
######### EDIT #######
##################### */

router.get("/:cryptoId/edit", async (req, res) => {
  const cryptoId = req.params.cryptoId;

  try {
    const crypto = await cryptoService.getOne(cryptoId).lean();

    const selectedData = getSelectDataFields(crypto);

    res.render("crypto/edit", {
      title: "Edit Page",
      crypto,
      payment: selectedData,
    });
  } catch (err) {
    // TODO: Edit
    console.log(err);
  }
});

router.post("/:cryptoId/edit", async (req, res) => {
  const cryptoId = req.params.cryptoId;
  const cryptoData = req.body;

  try {
    const crypto = await cryptoService.edit(cryptoId, cryptoData);

    res.redirect(`/crypto/${cryptoId}/details`);
  } catch (err) {
    // TODO: ERROR HANDLING
    console.log(err);
  }
});

/* ####################
######### HELPERS #######
##################### */

function getSelectDataFields({ cryptoData }) {
  const cryptoValues = ["crypto-wallet", "credit-card", "debit-card", "paypal"];

  const cryptoOptionsView = cryptoValues.map((type) => ({
    value: type,
    opt: type,
    selected: cryptoData === type ? "selected" : "",
  }));

  return cryptoOptionsView;
}

export default router;
