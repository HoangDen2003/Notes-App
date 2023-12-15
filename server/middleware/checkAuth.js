module.exports.isLoggedIn = function (req, res, next) {
  req.user ? next() : res.status(401).send("Access Denied");
  // req.user ? next() : res.status(401).render("/404");
};
