const express = require('express');
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.use("/auth", require("./auth/auth.route"))
router.use("/categories", authenticate, require("./categories/categories.route"));
router.use("/expenses", authenticate, require("./expenses/expenses.route"));
router.use("/reports", authenticate, require("./reports/reports.route"));

module.exports = router