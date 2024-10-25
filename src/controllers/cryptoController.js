import { Router } from "express";
import cryptoService from "../services/cryptoService.js";

const router = Router();

/* ####################
######### CREATE #######
##################### */
router.get("/create", (req, res) => {
    const cryptoData = req.body;
    const selectedData = getSelectDataFields(cryptoData);
  res.render("crypto/create", { title: "Create Page", payment : selectedData });
});

router.post("/create", async (req, res) => {
  const cryptoData = req.body;
  const userId = req.user._id;

    try {
        await cryptoService.create(cryptoData, userId);
        res.redirect('/crypto/catalog');
    } catch (err) {
        
        // FIXME: Error handleing
        console.log(err.message);
        
  }
});

function getSelectDataFields({cryptoData}) {
    const cryptoValues = ["crypto-wallet", "credit-card", "debit-card", "paypal"];
    
    const cryptoOptionsView = cryptoValues.map((type) => ({
      value: type,
      opt: type,
      selected: cryptoData === type ? "selected" : "",
    }));

    return cryptoOptionsView;

}

export default router;
