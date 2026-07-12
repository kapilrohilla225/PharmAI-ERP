const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const employeeService = require("../services/employee.service");

const createEmployee = asyncHandler(async (req, res) => {

    const employee = await employeeService.createEmployee(
        req.body,
        req.user._id
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Employee Created Successfully",
            employee
        )
    );

});

const getEmployees = asyncHandler(async (req, res) => {

    const employees = await employeeService.getEmployees();

    res.status(200).json(
        new ApiResponse(
            200,
            "Employees Fetched Successfully",
            employees
        )
    );

});

const getEmployeeById = asyncHandler(async (req, res) => {

    const employee = await employeeService.getEmployeeById(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Employee Details",
            employee
        )
    );

});

const updateEmployee = asyncHandler(async (req, res) => {

    const employee = await employeeService.updateEmployee(
        req.params.id,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Employee Updated Successfully",
            employee
        )
    );

});

const deleteEmployee = asyncHandler(async (req, res) => {

    await employeeService.deleteEmployee(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Employee Deleted Successfully"
        )
    );

});

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};