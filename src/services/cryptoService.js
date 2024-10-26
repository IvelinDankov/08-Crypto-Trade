import Crypto from "../models/Crypto.js";

const getAll = (filter = {}) => {
  const query = Crypto.find();

  if (filter.nameSearch) {
    query.find({ name: { $regex: filter.nameSearch, $options: "i" } });
  }

  if (filter.payment) {
    query.find({ payment: filter.payment });
  }

  return query;
};

const create = (cryptoData, ownerId) => {
  return Crypto.create({ ...cryptoData, owner: ownerId });
};

const getOne = (id) => {
  return Crypto.findById(id);
};

const buy = (cryptoId, userId) => {
  return Crypto.findByIdAndUpdate(cryptoId, { $push: { buyCrypto: userId } });
};

const remove = (id) => {
  return Crypto.findByIdAndDelete(id);
};

const edit = (id, data) => {
  return Crypto.findByIdAndUpdate(id, data, { runValidators: true });
};

export default {
  getAll,
  create,
  getOne,
  buy,
  remove,
  edit,
};
