require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Employee = require("../models/Employee");
const Product = require("../models/Product");

const connectDB = require("../config/db");

const seed = async () => {
  try {
    await connectDB();

    console.log("Database Connected");

    await User.deleteMany();

    await Employee.deleteMany();

    await Product.deleteMany();

    console.log("Old Data Deleted");

    const admin = await User.create({
      fullName: "Kapil Rohilla",

      email: "kapilrohilla206@gmail.com",

      password: "Admin@123",

      role: "admin",
    });

    console.log("Admin Created");

    await Employee.insertMany([
    {
        employeeId: "EMP0001",
        fullName: "Kapil Rohilla",
        email: "kapil@gmail.com",
        phone: "9999999999",
        department: "IT",
        designation: "Software Developer",
        salary: 50000,
        joiningDate: new Date("2026-01-15"),
        address: "Ahmedabad",
        createdBy: admin._id
    },
    {
        employeeId: "EMP0002",
        fullName: "Rahul Sharma",
        email: "rahul@gmail.com",
        phone: "8888888888",
        department: "HR",
        designation: "HR Executive",
        salary: 40000,
        joiningDate: new Date("2026-02-01"),
        address: "Delhi",
        createdBy: admin._id
    }
]);

    console.log("Employees Added");

    await Product.insertMany([
    {
        productCode: "PRD0001",
        productName: "Paracetamol 500mg",
        category: "Tablet",
        manufacturer: "Sun Pharma",
        batchNo: "BAT001",
        quantity: 120,
        purchasePrice: 10,
        sellingPrice: 15,
        expiryDate: new Date("2027-12-31"),
        minimumStock: 20,
        createdBy: admin._id
    },
    {
        productCode: "PRD0002",
        productName: "Vitamin C",
        category: "Tablet",
        manufacturer: "Cipla",
        batchNo: "BAT002",
        quantity: 80,
        purchasePrice: 20,
        sellingPrice: 30,
        expiryDate: new Date("2028-05-10"),
        minimumStock: 15,
        createdBy: admin._id
    },
    {
        productCode: "PRD0003",
        productName: "Azithromycin",
        category: "Capsule",
        manufacturer: "Mankind",
        batchNo: "BAT003",
        quantity: 50,
        purchasePrice: 50,
        sellingPrice: 70,
        expiryDate: new Date("2028-02-15"),
        minimumStock: 10,
        createdBy: admin._id
    },
    {
        productCode: "PRD0004",
        productName: "Dolo 650",
        category: "Tablet",
        manufacturer: "Micro Labs",
        batchNo: "BAT004",
        quantity: 150,
        purchasePrice: 8,
        sellingPrice: 12,
        expiryDate: new Date("2028-08-20"),
        minimumStock: 30,
        createdBy: admin._id
    }
]);

    console.log("Products Added");

    console.log("Seeder Completed");

    process.exit();
  } catch (err) {
    console.log(err);

    process.exit(1);
  }
};

seed();