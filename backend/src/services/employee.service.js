const Employee = require("../models/Employee");
const ApiError = require("../utils/ApiError");
const generateCode = require("../utils/generateCode");
const auditService = require("../services/audit.service");
const ApiFeatures = require("../utils/apiFeatures");

const createEmployee = async (data, userId) => {
  const existingEmployee = await Employee.findOne({
    email: data.email,
  });

  if (existingEmployee) {
    throw new ApiError(409, "Employee already exists");
  }

  const employeeId = await generateCode(Employee, "employeeId", "EMP");

  const employee = await Employee.create({
    ...data,
    employeeId,
    createdBy: userId,
  });

  await auditService.createLog({
    user: req.user._id,

    module: "Employee",

    action: "Create",

    description: `Employee ${employee.fullName} Created`,

    ipAddress: req.ip,
  });

  return employee;
};

const getEmployees = async (query) => {
  const features = new ApiFeatures(
    Employee.find(),

    query,
  )

    .search(["fullName", "email", "department"])

    .filter()

    .sort()

    .paginate();

  return await features.query;
};

const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return employee;
};

const updateEmployee = async (id, data) => {
  const employee = await Employee.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

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
