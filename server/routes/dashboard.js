const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { isLoggedIn } = require("../middleware/checkAuth");

/**
 * Dashboard Routes
 */
router.get("/dashboard", isLoggedIn, dashboardController.dashboard);
router.get(
  "/dashboard/item/:id",
  isLoggedIn,
  dashboardController.dashboardViewNote
);
router.put(
  "/dashboard/item/:id",
  isLoggedIn,
  dashboardController.dashboardUpdateNote
);
router.get("/dashboard/add", isLoggedIn, dashboardController.dashboardAddNote);
router.post(
  "/dashboard/add",
  isLoggedIn,
  dashboardController.dashboardAddNoteSubmit
);
router.delete(
  "/dashboard/item-delete/:id",
  isLoggedIn,
  dashboardController.dashboardDeleteNote
);
router.post(
  "/dashboard/search",
  isLoggedIn,
  dashboardController.dashboardSearchNoteSubmit
);
router.get(
  "/dashboard/search",
  isLoggedIn,
  dashboardController.dashboardSearchNote
);

module.exports = router;
