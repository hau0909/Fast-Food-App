module.exports = (req, res, next) => {
  const { page, limit } = req.query;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  req.paging = { pageNum, limitNum, skip };
  next();
};
