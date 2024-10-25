import Crypto from "../models/Crypto.js";

const create = (cryptoData, ownerId) => {
    // FIXME: Make at first crypto model
    
    return Crypto.create({ ...cryptoData, owner: ownerId });
};

export default {
  create,
};
