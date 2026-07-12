const Employee = require("../models/Employee");
const ApiError = require("../utils/ApiError");

const createEmployee = async (data, userId) => {

    const employee = await Employee.create({
        ...data,
        createdBy: userId,
    });

    return employee;
};

const getEmployees = async () => {

    return await Employee.find().sort({ createdAt: -1 });

};

const getEmployeeById = async (id) => {

    const employee = await Employee.findById(id);

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return employee;
};

const updateEmployee = async (id, data) => {

    const employee = await Employee.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return employee;
};

const deleteEmployee = async (id) => {

    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
        throw new ApiError(404, "Employee not found");
    }

    return employee;
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};