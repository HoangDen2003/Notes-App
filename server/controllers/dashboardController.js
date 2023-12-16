const Note = require("../models/Notes");
const User = require("../models/User");
const mongoose = require("mongoose");
const { search } = require("../routes/dashboard");

/**
 * GET /
 * Dashboard
 */
module.exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = Number(req.query.page || 1); // ? 2

  const locals = {
    title: "Home DashBoard",
    description: "Free Notes App'Hoang",
  };

  try {
    const notes = await Note.aggregate([
      {
        $sort: { createAt: -1 },
      },
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage) // ? 12 * 2 - 12 = 12
      .limit(perPage) // ? 12
      .exec();

    const count = await Note.find({});
    res.render("dashboard/index", {
      notes,
      userName: req.user.firstName,
      locals,
      layout: "../views/layouts/dashboard",
      current: Number(page),
      maxPages: Math.ceil(count.length / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * View Specific Note
 */
module.exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({
      user: req.user.id,
    })
    .lean();

  const locals = {
    title: note.title,
  };

  if (note) {
    res.render("dashboard/view-notes", {
      locals,
      noteId: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong...");
  }
};

/**
 * PUT /
 * Update Note
 */
module.exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findByIdAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Add Note
 */
module.exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

/**
 * POST /
 * Add Note <Create Note>
 */
module.exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * DELETE /
 * Delete Note
 */
module.exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({
      user: req.user.id,
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * * POST SEARCH /
 */
module.exports.dashboardSearchNoteSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;

    // const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const searchNoSpecialChars = searchTerm.replace(
      /[\x5F]+[^a-zA-Z0-9 ]/g,
      ""
    );

    const searchResults = await Note.find({
      $or: [
        // todo: $regex: ttruy vấn chuỗi regex <mẫu pattern thay thế cho các value cụ thể ví dụ: 123 -> 12345 ... >
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } }, // -> tạo chuỗi /123/i: không quan tâm chữ hoa thường
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    const locals = {
      title: "Dashboard Search",
      description: "Free Notes App'Hoang",
    };

    // const searchResults = await Note.find({
    //   $or: [
    //     {
    //       title: searchTerm,
    //     },
    //     {
    //       body: searchTerm,
    //     },
    //   ],
    // });

    res.render("dashboard/search", {
      locals,
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * * GET SEARCH /
 */
module.exports.dashboardSearchNote = async (req, res) => {
  try {
    console.log("get: ", searchResults);

    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};
