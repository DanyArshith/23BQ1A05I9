function notFound(req, res) {
  res.status(404).json({ success: false, error: "route not found" });
}

module.exports = { notFound };
