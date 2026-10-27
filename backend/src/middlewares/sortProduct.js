module.exports = (req, res, next) => {
  const { sortBy, order } = req.query;

  req.sortOptions = sortBy
    ? { [sortBy]: order === "desc" ? -1 : 1, _id: order === "desc" ? -1 : 1 }
    : { createdAt: -1 };

  next();
};
