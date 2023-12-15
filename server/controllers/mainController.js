/**
 * GET /
 * Homepage
 */
module.exports.homepage = async (req, res) => {
  const locals = {
    title: "Nodejs notes",
    description: "Free Notes App's Hoang",
  };

  res.render("index", {
    locals,
    layout: "../views/layouts/front-page",
  });
};

module.exports.about = async (req, res) => {
  const locals = {
    title: "About Nodejs notes",
    description: "About Free Notes App's Hoang",
  };

  res.render("about", locals);
};
