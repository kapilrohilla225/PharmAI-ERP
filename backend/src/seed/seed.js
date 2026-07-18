require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Employee = require("../models/Employee");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Purchase = require("../models/Purchase");
const Sale = require("../models/Sale");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

const connectDB = require("../config/db");

const hashPassword = async (pw) => bcrypt.hash(pw, 10);

const seed = async () => {
  try {
    await connectDB();

    console.log("Database Connected");

    // ─── Wipe existing data ────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany(),
      Employee.deleteMany(),
      Product.deleteMany(),
      Supplier.deleteMany(),
      Purchase.deleteMany(),
      Sale.deleteMany(),
      Notification.deleteMany(),
      AuditLog.deleteMany(),
    ]);
    console.log("Old data deleted");

    // ─── Create Users + Employees ──────────────────────────────────────────
    const password123456 = await hashPassword("123456");

    const employeeUsers = [
      { fullName: "Priya Sharma", email: "priya.sharma@glosspharma.com", role: "hr", phone: "9812345670" },
      { fullName: "Amit Verma", email: "amit.verma@glosspharma.com", role: "hr", phone: "9812345671" },
      { fullName: "Sunita Patel", email: "sunita.patel@glosspharma.com", role: "hr", phone: "9812345672" },
      { fullName: "Rahul Kumar", email: "rahul.kumar@glosspharma.com", role: "sales", phone: "9812345673" },
      { fullName: "Deepa Singh", email: "deepa.singh@glosspharma.com", role: "sales", phone: "9812345674" },
      { fullName: "Vikram Joshi", email: "vikram.joshi@glosspharma.com", role: "sales", phone: "9812345675" },
      { fullName: "Anita Gupta", email: "anita.gupta@glosspharma.com", role: "employee", phone: "9812345676" },
      { fullName: "Rajesh Mishra", email: "rajesh.mishra@glosspharma.com", role: "employee", phone: "9812345677" },
      { fullName: "Meena Reddy", email: "meena.reddy@glosspharma.com", role: "employee", phone: "9812345678" },
      { fullName: "Suresh Nair", email: "suresh.nair@glosspharma.com", role: "employee", phone: "9812345679" },
      { fullName: "Neha Kapoor", email: "neha.kapoor@glosspharma.com", role: "sales", phone: "9812345680" },
    ];

    // Use insertMany with pre-hashed passwords (bypasses the pre-save hook)
    const createdUsers = await User.insertMany(
      employeeUsers.map((u) => ({
        ...u,
        password: password123456,
        isDefaultAdmin: false,
      }))
    );

    // Create admin user separately (different password)
    const adminUser = await User.create({
      fullName: "Kapil Rohilla",
      email: "kapilrohilla206@gmail.com",
      password: "Admin@123",
      role: "admin",
      isDefaultAdmin: true,
    });
    console.log(`Admin created: ${adminUser.email}`);

    const allUsers = [adminUser, ...createdUsers];

    // Employee records matching the users
    const employeeRecords = [
      { employeeId: "EMP0001", fullName: "Kapil Rohilla", email: "kapilrohilla206@gmail.com", phone: "9999999999", department: "IT", designation: "Software Developer", salary: 65000, joiningDate: new Date("2025-06-01"), address: "Ahmedabad, Gujarat", createdBy: adminUser._id },
      { employeeId: "EMP0002", fullName: "Priya Sharma", email: "priya.sharma@glosspharma.com", phone: "9812345670", department: "HR", designation: "HR Manager", salary: 55000, joiningDate: new Date("2025-07-15"), address: "New Delhi", createdBy: adminUser._id },
      { employeeId: "EMP0003", fullName: "Amit Verma", email: "amit.verma@glosspharma.com", phone: "9812345671", department: "HR", designation: "HR Executive", salary: 38000, joiningDate: new Date("2025-09-01"), address: "Gurgaon, Haryana", createdBy: adminUser._id },
      { employeeId: "EMP0004", fullName: "Sunita Patel", email: "sunita.patel@glosspharma.com", phone: "9812345672", department: "HR", designation: "Recruitment Specialist", salary: 42000, joiningDate: new Date("2026-01-10"), address: "Noida, UP", createdBy: adminUser._id },
      { employeeId: "EMP0005", fullName: "Rahul Kumar", email: "rahul.kumar@glosspharma.com", phone: "9812345673", department: "Sales", designation: "Sales Manager", salary: 60000, joiningDate: new Date("2025-05-20"), address: "Mumbai, Maharashtra", createdBy: adminUser._id },
      { employeeId: "EMP0006", fullName: "Deepa Singh", email: "deepa.singh@glosspharma.com", phone: "9812345674", department: "Sales", designation: "Sales Representative", salary: 35000, joiningDate: new Date("2025-10-05"), address: "Pune, Maharashtra", createdBy: adminUser._id },
      { employeeId: "EMP0007", fullName: "Vikram Joshi", email: "vikram.joshi@glosspharma.com", phone: "9812345675", department: "Sales", designation: "Territory Manager", salary: 48000, joiningDate: new Date("2025-11-12"), address: "Bangalore, Karnataka", createdBy: adminUser._id },
      { employeeId: "EMP0008", fullName: "Anita Gupta", email: "anita.gupta@glosspharma.com", phone: "9812345676", department: "Operations", designation: "Operations Executive", salary: 40000, joiningDate: new Date("2025-08-18"), address: "Chennai, Tamil Nadu", createdBy: adminUser._id },
      { employeeId: "EMP0009", fullName: "Rajesh Mishra", email: "rajesh.mishra@glosspharma.com", phone: "9812345677", department: "Warehouse", designation: "Warehouse Manager", salary: 45000, joiningDate: new Date("2025-04-01"), address: "Ahmedabad, Gujarat", createdBy: adminUser._id },
      { employeeId: "EMP0010", fullName: "Meena Reddy", email: "meena.reddy@glosspharma.com", phone: "9812345678", department: "Finance", designation: "Accountant", salary: 52000, joiningDate: new Date("2025-06-20"), address: "Hyderabad, Telangana", createdBy: adminUser._id },
      { employeeId: "EMP0011", fullName: "Suresh Nair", email: "suresh.nair@glosspharma.com", phone: "9812345679", department: "IT", designation: "System Administrator", salary: 58000, joiningDate: new Date("2025-03-15"), address: "Kochi, Kerala", createdBy: adminUser._id },
      { employeeId: "EMP0012", fullName: "Neha Kapoor", email: "neha.kapoor@glosspharma.com", phone: "9812345680", department: "Sales", designation: "Pharma Consultant", salary: 44000, joiningDate: new Date("2025-12-01"), address: "Jaipur, Rajasthan", createdBy: adminUser._id },
    ];

    await Employee.insertMany(employeeRecords);
    console.log(`Employees added: ${employeeRecords.length}`);

    // ─── Create Suppliers ─────────────────────────────────────────────────
    const suppliers = await Supplier.insertMany([
      { supplierCode: "SUP0001", name: "Sun Pharmaceutical Industries Ltd", email: "orders@sunpharma.com", phone: "022-66455600", address: "SPARC, Tandalja, Vadodara", city: "Vadodara", state: "Gujarat", gstNumber: "24AAACS1234A1Z5", contactPerson: "Ramesh Patel", status: "Active" },
      { supplierCode: "SUP0002", name: "Cipla Limited", email: "supply@cipla.com", phone: "022-62184000", address: "Cipla House, Peninsula Business Park", city: "Mumbai", state: "Maharashtra", gstNumber: "27AABCC5678B1Z6", contactPerson: "Sneha Desai", status: "Active" },
      { supplierCode: "SUP0003", name: "Mankind Pharma", email: "vendor@mankindpharma.com", phone: "011-46520000", address: "Okhla Industrial Area", city: "New Delhi", state: "Delhi", gstNumber: "07AAECM9010N1Z8", contactPerson: "Vijay Singh", status: "Active" },
      { supplierCode: "SUP0004", name: "Dr. Reddy's Laboratories", email: "procurement@drreddys.com", phone: "040-49002222", address: "8-2-337, Road No. 3, Banjara Hills", city: "Hyderabad", state: "Telangana", gstNumber: "36AABCD3456L1ZT", contactPerson: "Prakash Reddy", status: "Active" },
      { supplierCode: "SUP0005", name: "Lupin Limited", email: "sourcing@lupin.com", phone: "022-24994300", address: "Lupin House, Kalina", city: "Mumbai", state: "Maharashtra", gstNumber: "27AABCL7890K1Z9", contactPerson: "Farhan Khan", status: "Active" },
      { supplierCode: "SUP0006", name: "Alkem Laboratories Ltd", email: "suppliers@alkem.com", phone: "022-39829999", address: "Alkem House, Senapati Bapat Marg", city: "Mumbai", state: "Maharashtra", gstNumber: "27AAECA2345H1Z4", contactPerson: "Anjali Mehta", status: "Active" },
    ]);
    console.log(`Suppliers added: ${suppliers.length}`);

    // ─── Create Products ──────────────────────────────────────────────────
    const now = new Date();
    const futureDate = (monthsAhead) => {
      const d = new Date();
      d.setMonth(d.getMonth() + monthsAhead);
      return d;
    };
    const pastDate = (monthsAgo) => {
      const d = new Date();
      d.setMonth(d.getMonth() - monthsAgo);
      return d;
    };

    const products = await Product.insertMany([
      // Expired products (to trigger expiry alerts)
      { productCode: "PRD0001", productName: "Paracetamol 500mg", category: "Tablet", manufacturer: "Sun Pharma", batchNo: "SNP-2401", quantity: 45, purchasePrice: 8.50, sellingPrice: 15.00, expiryDate: pastDate(2), minimumStock: 20, createdBy: adminUser._id },
      { productCode: "PRD0002", productName: "Amoxicillin 250mg", category: "Capsule", manufacturer: "Cipla", batchNo: "CIP-2308", quantity: 0, purchasePrice: 25.00, sellingPrice: 45.00, expiryDate: pastDate(4), minimumStock: 30, createdBy: adminUser._id },

      // Expiring within 30 days
      { productCode: "PRD0003", productName: "Azithromycin 500mg", category: "Tablet", manufacturer: "Mankind", batchNo: "MKD-2412", quantity: 120, purchasePrice: 45.00, sellingPrice: 78.00, expiryDate: futureDate(0.75), minimumStock: 25, createdBy: adminUser._id },
      { productCode: "PRD0004", productName: "Cetirizine 10mg", category: "Tablet", manufacturer: "Dr. Reddy's", batchNo: "DRL-2501", quantity: 200, purchasePrice: 3.00, sellingPrice: 8.00, expiryDate: futureDate(0.5), minimumStock: 50, createdBy: adminUser._id },

      // Low stock products
      { productCode: "PRD0005", productName: "Dolo 650mg", category: "Tablet", manufacturer: "Micro Labs", batchNo: "ML-2503", quantity: 5, purchasePrice: 7.00, sellingPrice: 12.00, expiryDate: futureDate(18), minimumStock: 50, createdBy: adminUser._id },
      { productCode: "PRD0006", productName: "Vitamin C 500mg", category: "Tablet", manufacturer: "Cipla", batchNo: "CIP-2504", quantity: 8, purchasePrice: 15.00, sellingPrice: 28.00, expiryDate: futureDate(20), minimumStock: 30, createdBy: adminUser._id },
      { productCode: "PRD0007", productName: "Omeprazole 20mg", category: "Capsule", manufacturer: "Sun Pharma", batchNo: "SNP-2502", quantity: 3, purchasePrice: 12.00, sellingPrice: 22.00, expiryDate: futureDate(22), minimumStock: 40, createdBy: adminUser._id },

      // Out of stock
      { productCode: "PRD0008", productName: "Ibuprofen 400mg", category: "Tablet", manufacturer: "Alkem", batchNo: "AL-2409", quantity: 0, purchasePrice: 10.00, sellingPrice: 18.00, expiryDate: futureDate(14), minimumStock: 25, createdBy: adminUser._id },

      // Healthy stock products
      { productCode: "PRD0009", productName: "Metformin 500mg", category: "Tablet", manufacturer: "Lupin", batchNo: "LPN-2505", quantity: 500, purchasePrice: 6.00, sellingPrice: 11.00, expiryDate: futureDate(24), minimumStock: 50, createdBy: adminUser._id },
      { productCode: "PRD0010", productName: "Amlodipine 5mg", category: "Tablet", manufacturer: "Dr. Reddy's", batchNo: "DRL-2506", quantity: 350, purchasePrice: 5.00, sellingPrice: 10.00, expiryDate: futureDate(26), minimumStock: 40, createdBy: adminUser._id },
      { productCode: "PRD0011", productName: "Atorvastatin 10mg", category: "Tablet", manufacturer: "Sun Pharma", batchNo: "SNP-2507", quantity: 280, purchasePrice: 18.00, sellingPrice: 35.00, expiryDate: futureDate(28), minimumStock: 30, createdBy: adminUser._id },
      { productCode: "PRD0012", productName: "Cough Syrup AL", category: "Syrup", manufacturer: "Mankind", batchNo: "MKD-2502", quantity: 150, purchasePrice: 35.00, sellingPrice: 65.00, expiryDate: futureDate(16), minimumStock: 20, createdBy: adminUser._id },
      { productCode: "PRD0013", productName: "Ceftriaxone 1gm Injection", category: "Injection", manufacturer: "Alkem", batchNo: "AL-2504", quantity: 100, purchasePrice: 55.00, sellingPrice: 95.00, expiryDate: futureDate(14), minimumStock: 15, createdBy: adminUser._id },
      { productCode: "PRD0014", productName: "Multivitamin Tablets", category: "Tablet", manufacturer: "Cipla", batchNo: "CIP-2508", quantity: 600, purchasePrice: 25.00, sellingPrice: 49.00, expiryDate: futureDate(30), minimumStock: 60, createdBy: adminUser._id },
      { productCode: "PRD0015", productName: "Insulin Regular 40IU", category: "Injection", manufacturer: "Lupin", batchNo: "LPN-2503", quantity: 80, purchasePrice: 180.00, sellingPrice: 320.00, expiryDate: futureDate(10), minimumStock: 20, createdBy: adminUser._id },
      { productCode: "PRD0016", productName: "Aspirin 75mg", category: "Tablet", manufacturer: "Dr. Reddy's", batchNo: "DRL-2509", quantity: 420, purchasePrice: 4.00, sellingPrice: 9.00, expiryDate: futureDate(28), minimumStock: 50, createdBy: adminUser._id },
      { productCode: "PRD0017", productName: "Albendazole 400mg", category: "Tablet", manufacturer: "Mankind", batchNo: "MKD-2405", quantity: 90, purchasePrice: 12.00, sellingPrice: 22.00, expiryDate: futureDate(12), minimumStock: 20, createdBy: adminUser._id },
      { productCode: "PRD0018", productName: "Ranitidine 150mg", category: "Tablet", manufacturer: "Sun Pharma", batchNo: "SNP-2510", quantity: 250, purchasePrice: 5.00, sellingPrice: 10.00, expiryDate: futureDate(22), minimumStock: 30, createdBy: adminUser._id },
      { productCode: "PRD0019", productName: "Salbutamol Inhaler", category: "Inhaler", manufacturer: "Cipla", batchNo: "CIP-2506", quantity: 60, purchasePrice: 85.00, sellingPrice: 155.00, expiryDate: futureDate(15), minimumStock: 10, createdBy: adminUser._id },
      { productCode: "PRD0020", productName: "Digoxin 0.25mg", category: "Tablet", manufacturer: "Lupin", batchNo: "LPN-2511", quantity: 180, purchasePrice: 8.00, sellingPrice: 16.00, expiryDate: futureDate(36), minimumStock: 20, createdBy: adminUser._id },
      { productCode: "PRD0021", productName: "Losartan 50mg", category: "Tablet", manufacturer: "Alkem", batchNo: "AL-2512", quantity: 310, purchasePrice: 7.00, sellingPrice: 14.00, expiryDate: futureDate(30), minimumStock: 40, createdBy: adminUser._id },
      { productCode: "PRD0022", productName: "Eye Drop Moisturizing", category: "Drops", manufacturer: "Dr. Reddy's", batchNo: "DRL-2507", quantity: 45, purchasePrice: 30.00, sellingPrice: 55.00, expiryDate: futureDate(8), minimumStock: 15, createdBy: adminUser._id },
    ]);
    console.log(`Products added: ${products.length}`);

    // ─── Create Purchase Records ──────────────────────────────────────────
    const purchaseRecords = [
      { purchaseNumber: "PUR-2025-001", supplierName: "Sun Pharmaceutical Industries Ltd", supplierEmail: "orders@sunpharma.com", supplierPhone: "022-66455600", product: products[0]._id, quantity: 200, purchasePrice: 8.50, totalAmount: 1700, purchaseDate: new Date("2025-08-01"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-002", supplierName: "Cipla Limited", supplierEmail: "supply@cipla.com", supplierPhone: "022-62184000", product: products[1]._id, quantity: 150, purchasePrice: 25.00, totalAmount: 3750, purchaseDate: new Date("2025-08-15"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-003", supplierName: "Mankind Pharma", supplierEmail: "vendor@mankindpharma.com", supplierPhone: "011-46520000", product: products[2]._id, quantity: 300, purchasePrice: 45.00, totalAmount: 13500, purchaseDate: new Date("2025-09-10"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-004", supplierName: "Dr. Reddy's Laboratories", supplierEmail: "procurement@drreddys.com", supplierPhone: "040-49002222", product: products[3]._id, quantity: 500, purchasePrice: 3.00, totalAmount: 1500, purchaseDate: new Date("2025-09-25"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-005", supplierName: "Lupin Limited", supplierEmail: "sourcing@lupin.com", supplierPhone: "022-24994300", product: products[8]._id, quantity: 1000, purchasePrice: 6.00, totalAmount: 6000, purchaseDate: new Date("2025-10-05"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-006", supplierName: "Alkem Laboratories Ltd", supplierEmail: "suppliers@alkem.com", supplierPhone: "022-39829999", product: products[7]._id, quantity: 100, purchasePrice: 10.00, totalAmount: 1000, purchaseDate: new Date("2025-10-20"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-007", supplierName: "Sun Pharmaceutical Industries Ltd", supplierEmail: "orders@sunpharma.com", supplierPhone: "022-66455600", product: products[10]._id, quantity: 500, purchasePrice: 18.00, totalAmount: 9000, purchaseDate: new Date("2025-11-01"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-008", supplierName: "Mankind Pharma", supplierEmail: "vendor@mankindpharma.com", supplierPhone: "011-46520000", product: products[11]._id, quantity: 200, purchasePrice: 35.00, totalAmount: 7000, purchaseDate: new Date("2025-11-15"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-009", supplierName: "Cipla Limited", supplierEmail: "supply@cipla.com", supplierPhone: "022-62184000", product: products[13]._id, quantity: 800, purchasePrice: 25.00, totalAmount: 20000, purchaseDate: new Date("2025-12-01"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2025-010", supplierName: "Alkem Laboratories Ltd", supplierEmail: "suppliers@alkem.com", supplierPhone: "022-39829999", product: products[12]._id, quantity: 150, purchasePrice: 55.00, totalAmount: 8250, purchaseDate: new Date("2025-12-15"), paymentStatus: "Pending", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2026-001", supplierName: "Dr. Reddy's Laboratories", supplierEmail: "procurement@drreddys.com", supplierPhone: "040-49002222", product: products[15]._id, quantity: 1000, purchasePrice: 4.00, totalAmount: 4000, purchaseDate: new Date("2026-01-10"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2026-002", supplierName: "Lupin Limited", supplierEmail: "sourcing@lupin.com", supplierPhone: "022-24994300", product: products[14]._id, quantity: 120, purchasePrice: 180.00, totalAmount: 21600, purchaseDate: new Date("2026-01-25"), paymentStatus: "Partial", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2026-003", supplierName: "Sun Pharmaceutical Industries Ltd", supplierEmail: "orders@sunpharma.com", supplierPhone: "022-66455600", product: products[17]._id, quantity: 400, purchasePrice: 5.00, totalAmount: 2000, purchaseDate: new Date("2026-02-05"), paymentStatus: "Paid", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2026-004", supplierName: "Cipla Limited", supplierEmail: "supply@cipla.com", supplierPhone: "022-62184000", product: products[18]._id, quantity: 80, purchasePrice: 85.00, totalAmount: 6800, purchaseDate: new Date("2026-02-18"), paymentStatus: "Pending", createdBy: adminUser._id },
      { purchaseNumber: "PUR-2026-005", supplierName: "Mankind Pharma", supplierEmail: "vendor@mankindpharma.com", supplierPhone: "011-46520000", product: products[4]._id, quantity: 100, purchasePrice: 7.00, totalAmount: 700, purchaseDate: new Date("2026-03-01"), paymentStatus: "Pending", createdBy: adminUser._id },
    ];

    await Purchase.insertMany(purchaseRecords);
    console.log(`Purchases added: ${purchaseRecords.length}`);

    // ─── Create Sample Sale Records ────────────────────────────────────────
    const saleRecords = [
      { invoiceNumber: "INV-2025-001", customerName: "Rajesh Medical Store", customerPhone: "9876543210", product: products[0]._id, quantity: 20, sellingPrice: 15.00, totalAmount: 300, paymentMethod: "UPI", createdBy: createdUsers[3]._id },
      { invoiceNumber: "INV-2025-002", customerName: "Sharma Pharmacy", customerPhone: "9876543211", product: products[4]._id, quantity: 15, sellingPrice: 12.00, totalAmount: 180, paymentMethod: "Cash", createdBy: createdUsers[3]._id },
      { invoiceNumber: "INV-2025-003", customerName: "Gupta Medicals", customerPhone: "9876543212", product: products[8]._id, quantity: 30, sellingPrice: 11.00, totalAmount: 330, paymentMethod: "Card", createdBy: createdUsers[4]._id },
      { invoiceNumber: "INV-2025-004", customerName: "Apollo Pharmacy", customerPhone: "9876543213", product: products[9]._id, quantity: 50, sellingPrice: 10.00, totalAmount: 500, paymentMethod: "UPI", createdBy: createdUsers[5]._id },
      { invoiceNumber: "INV-2025-005", customerName: "MedPlus Store", customerPhone: "9876543214", product: products[13]._id, quantity: 25, sellingPrice: 49.00, totalAmount: 1225, paymentMethod: "Cash", createdBy: createdUsers[10]._id },
      { invoiceNumber: "INV-2026-001", customerName: "Wellness Pharmacy", customerPhone: "9876543215", product: products[6]._id, quantity: 10, sellingPrice: 22.00, totalAmount: 220, paymentMethod: "Card", createdBy: createdUsers[4]._id },
      { invoiceNumber: "INV-2026-002", customerName: "City Medical Hall", customerPhone: "9876543216", product: products[16]._id, quantity: 20, sellingPrice: 22.00, totalAmount: 440, paymentMethod: "UPI", createdBy: createdUsers[5]._id },
      { invoiceNumber: "INV-2026-003", customerName: "Prime Healthcare", customerPhone: "9876543217", product: products[19]._id, quantity: 40, sellingPrice: 16.00, totalAmount: 640, paymentMethod: "Cash", createdBy: createdUsers[10]._id },
    ];

    await Sale.insertMany(saleRecords);
    console.log(`Sales added: ${saleRecords.length}`);

    // ─── Summary ───────────────────────────────────────────────────────────
    console.log("\n========== SEED COMPLETED ==========");
    console.log(`Users: ${allUsers.length}`);
    console.log(`Employees: ${employeeRecords.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Suppliers: ${suppliers.length}`);
    console.log(`Purchases: ${purchaseRecords.length}`);
    console.log(`Sales: ${saleRecords.length}`);
    console.log("=====================================");
    console.log("\nLogin Credentials:");
    console.log("  Admin: kapilrohilla206@gmail.com / Admin@123");
    console.log("  HR: priya.sharma@glosspharma.com / 123456");
    console.log("  Sales: rahul.kumar@glosspharma.com / 123456");
    console.log("  Employee: anita.gupta@glosspharma.com / 123456");

    process.exit();
  } catch (err) {
    console.log("Seed Error:", err);
    process.exit(1);
  }
};

seed();
