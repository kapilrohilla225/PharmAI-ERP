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

  // Also create User account if it doesn't exist
  const User = require("../models/User");
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(409, "User account with this email already exists");
  }

  const employeeId = await generateCode(Employee, "employeeId", "EMP");

  // Map department to the fixed authorization roles only
  let role = "employee";
  const dept = (data.department || "").toLowerCase();
  if (dept.includes("hr") || dept.includes("human")) role = "hr";
  else if (dept.includes("sales")) role = "sales";
  else if (dept.includes("admin")) role = "admin";

  const newUser = await User.create({
    fullName: data.fullName,
    email: data.email,
    password: data.password || "Password@123", // Use provided password or fallback
    role: role,
    phone: data.phone || "",
    isActive: data.status !== "Inactive",
  });

  let employee;
  try {
    employee = await Employee.create({
      ...data,
      employeeId,
      createdBy: userId,
    });
  } catch (error) {
    await User.findByIdAndDelete(newUser._id);
    throw error;
  }

  await auditService.createLog({
    user: userId,
    module: "Employee",
    action: "Create",
    description: `Employee ${employee.fullName} Created as ${role}`,
    ipAddress: "127.0.0.1",
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
  const employee = await Employee.findById(id);

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  const User = require("../models/User");

  await Employee.findByIdAndDelete(id);
  await User.deleteOne({ email: employee.email });

  return employee;
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
