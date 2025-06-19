const Expense = require("../../models/Expenses.model");
const util = require("../../exports/util");

const createExpense = async (req, res) => {
  try {
    const { title, amount, categoryId, date, note } = req.body;

    if (!title || !amount || !categoryId || !date) {
      return util.ResFail(req, res, "All required fields must be provided.");
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      categoryId,
      date,
      note,
    });

    return util.ResSuss(req, res, expense, "Expense created successfully.");
  } catch (error) {
    console.error("Create expense error:", error);
    return util.ResFail(req, res, "Failed to create expense.");
  }
};

const getExpenses = async (req, res) => {
  try {
    const { categoryIds, categoryId, startDate, endDate } = req.query;

    const filters = {
      userId: req.user._id
    };

    if (categoryId) {
      filters.categoryId = categoryId;
    }

    if (util.notEmpty(categoryIds)) {
      filters.categoryId = { $in: categoryIds.map(category => util.objectId(category)) }
    }

    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate) filters.date.$lte = new Date(endDate);
    }

    const pageNo = util.defaultPageNo(req.query.pageNo);
    const pageSize = util.defaultPageNo(req.query.pageSize);

    const total = await Expense.countDocuments(filters);

    const expenses = await Expense.find(filters)
      .populate("categoryId")
      .sort({ date: -1 }) // most recent first
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize);

    return util.ResSuss(req, res, {
      total,
      pageNo: pageNo,
      pageSize: pageSize,
      data: expenses
    }, "Expenses fetched successfully.");
  } catch (error) {
    console.error("Get expenses error:", error);
    return util.ResFail(req, res, "Failed to fetch expenses.");
  }
};

const updateExpense = async (req, res) => {
  try {
    const { title, amount, categoryId, date, note } = req.body;
    const expenseId = req.params.id;

    const updated = await Expense.findOneAndUpdate(
      { _id: expenseId, userId: req.user._id },
      { title, amount, categoryId, date, note },
      { new: true }
    );

    if (!updated) {
      return util.ResFail(req, res, "Expense not found or not yours.");
    }

    return util.ResSuss(req, res, updated, "Expense updated successfully.");
  } catch (error) {
    console.error("Update expense error:", error);
    return util.ResFail(req, res, "Failed to update expense.");
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const deleted = await Expense.findOneAndDelete({
      _id: expenseId,
      userId: req.user._id,
    });

    if (!deleted) {
      return util.ResFail(req, res, "Expense not found or not yours.");
    }

    return util.ResSuss(req, res, null, "Expense deleted successfully.");
  } catch (error) {
    console.error("Delete expense error:", error);
    return util.ResFail(req, res, "Failed to delete expense.");
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
