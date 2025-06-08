const express = require("express");
const router = express.Router();

const ExpenseOperation = require("./expenses.operation");

router.get("/", ExpenseOperation.getExpenses);
router.post("/", ExpenseOperation.createExpense);
router.put("/:id", ExpenseOperation.updateExpense);
router.delete("/:id", ExpenseOperation.deleteExpense);

module.exports = router;
