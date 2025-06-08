const Expense = require('../../models/Expenses.model');
const util = require('../../exports/util');
const { convertListToExcel } = require('../../exports/export-excel');
const moment = require("moment");

const getReportStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, categoryIds } = req.query;

    const match = {
      userId: util.objectId(userId)
    };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    if (util.notEmpty(categoryIds)) {
      match.categoryId = { $in: categoryIds.map(category => util.objectId(category)) }
    }

    const stats = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            categoryId: '$categoryId',
            month: { $month: '$date' },
            year: { $year: '$date' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          category: '$category.name',
          month: '$_id.month',
          year: '$_id.year',
          totalAmount: 1,
        },
      },
      { $sort: { year: -1, month: -1 } }
    ]);

    return util.ResSuss(req, res, stats, 'Report statistics retrieved.');
  } catch (error) {
    console.error(error);
    return util.ResFail(req, res, 'Failed to generate report.');
  }
};

const exportReportToExcel = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, categoryIds } = req.query;

    const match = {
      userId: util.objectId(userId)
    };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    if (util.notEmpty(categoryIds)) {
      match.categoryId = { $in: categoryIds.map(category => util.objectId(category)) }
    }

    const expenses = await Expense.find(match)
      .populate('categoryId')
      .sort({ date: -1 });

    const filename = `Expense_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;

    const excelBuffer = await convertListToExcel('Expense Report', expenses, [
      {
        title: "Date",
        dataindex: "date",
        setting: { wch: 15 },
        render: (val) => moment(val).format("YYYY-MM-DD"),
      },
      {
        title: "Title",
        dataindex: "title",
        setting: { wch: 30 },
        render: (val) => val || '',
      },
      {
        title: "Category",
        dataindex: ["categoryId", "name"],
        setting: { wch: 20 },
        render: (val) => val || '',
      },
      {
        title: "Amount",
        dataindex: "amount",
        setting: { wch: 15 },
        render: (val) => Number(val).toFixed(2),
      },
      {
        title: "Note",
        dataindex: "note",
        setting: { wch: 40 },
        render: (val) => val || '',
      },
    ]);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    return res.send(excelBuffer);
  } catch (err) {
    console.error(err);
    return util.ResFail(req, res, 'Failed to export Excel report.');
  }
};

module.exports = {
  getReportStats,
  exportReportToExcel
};