const express = require("express");
const router = express.Router();

const CategoryOperation = require("./categories.operation");

router.get("/", CategoryOperation.getCategories);
router.post("/", CategoryOperation.createCategory);
router.put("/:id", CategoryOperation.updateCategory);
router.delete("/:id", CategoryOperation.deleteCategory);

module.exports = router;
