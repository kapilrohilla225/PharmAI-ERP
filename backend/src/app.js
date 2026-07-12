const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const errorHandler = require("./middlewares/error.middleware");

// =======================
// Global Middlewares
// =======================

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));


// =======================
// Routes
// =======================
// Routes

app.use("/api/v1", require("./routes"));
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/employees", require("./routes/employee.routes"));
app.use("/api/v1/products",require("./routes/product.routes"));
app.use("/api/v1/purchases",require("./routes/purchase.routes"));
app.use("/api/v1/dashboard", require("./routes/dashboard.routes"));
app.use("/api/v1/sales",require("./routes/sale.routes"));
app.use("/api/v1/documents",require("./routes/document.routes"));
app.use("/api/v1/reports", require("./routes/report.routes"));
app.use("/api/v1/ai", require("./routes/ai.routes"));
// =======================
// 404 Handler
// =======================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});


app.use(errorHandler);

module.exports = app;