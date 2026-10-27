module.exports = (req, res, next) => {
  const { name, category_id, is_available } = req.query;

  const filter = {};

  if (name) filter.name = { $regex: name, $options: "i" };
  if (category_id) filter.category_id = category_id;
  if (is_available !== undefined) filter.is_available = is_available === "true";

  req.filter = filter;
  next();
};
