const XLSX = require('xlsx-js-style');
const moment = require("moment");

/**
 * Converts a list of data into a styled Excel buffer (no temp file).
 *
 * @param {string} filename - The Excel sheet name (not used for file path anymore).
 * @param {Array} listData - Array of objects.
 * @param {Array<Object>} settings - Array describing headers and how to render each column.
 * @returns {Buffer} - Excel file as a buffer
 */
const convertListToExcel = async (filename, listData, settings) => {
    const headerTable = settings.map(item => item.title);
    const colSetting = settings.map(item => item.setting);

    const sheetData = [];
    listData.forEach((item, index) => {
        sheetData.push(
            settings.map(setting => {
                const keyPath = Array.isArray(setting.dataindex) ? setting.dataindex : [setting.dataindex];
                const value = keyPath.reduce((acc, curr) => (acc && acc[curr] !== undefined ? acc[curr] : null), item);
                return setting.render(value, item, index);
            })
        );
    });

    const wsData = [headerTable, ...sheetData];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        }
    };

    const cellStyle = {
        font: { bold: false },
        alignment: { wrapText: true },
        border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        }
    };

    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellAddress] || ws[cellAddress].v === undefined || ws[cellAddress].v === "") continue;

            ws[cellAddress].s = R === 0 ? headerStyle : cellStyle;
        }
    }

    ws['!autofilter'] = {
        ref: XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: 0, c: headerTable.length - 1 }
        })
    };

    ws['!cols'] = colSetting;
    XLSX.utils.book_append_sheet(wb, ws, filename);

    // Return the workbook as a buffer
    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
};

module.exports = {
    convertListToExcel,
};
