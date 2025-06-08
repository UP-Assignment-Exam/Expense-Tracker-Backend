const express = require('express');
const router = express.Router();
const ReportOperation = require('./reports.operation');

router.get('/statistics', ReportOperation.getReportStats);
router.get('/export', ReportOperation.exportReportToExcel);

module.exports = router;
