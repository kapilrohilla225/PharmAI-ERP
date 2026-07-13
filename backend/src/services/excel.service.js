const ExcelJS = require("exceljs");

const exportData = async (data, sheetName, res) => {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(sheetName);

    if (!data.length) {

        worksheet.addRow(["No Data"]);

    } else {

        worksheet.columns = Object.keys(data[0]).map(key => ({

            header: key,

            key,

            width: 25

        }));

        data.forEach(item => {

            worksheet.addRow(item);

        });

    }

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${sheetName}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();

};

module.exports = {
    exportData
};