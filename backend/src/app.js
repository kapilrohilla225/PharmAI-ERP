const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression=require("compression");
const { generalLimiter } = require("./middlewares/rateLimit.middleware");
const passport = require("./config/passport");
const app = express();
const errorHandler = require("./middlewares/error.middleware");

// =======================
// Global Middlewares
// =======================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

app.use(morgan("dev"));

app.use(generalLimiter);

app.use(passport.initialize());

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
app.use("/api/v1/audit",require("./routes/audit.routes"));
app.use("/api/v1/invoice", require("./routes/invoice.routes"));
app.use("/api/v1/settings", require("./routes/setting.routes"));
app.use("/api/v1/excel", require("./routes/excel.routes"));
app.use("/api/v1/notifications",require("./routes/notification.routes"));
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));
app.use("/api/v1/system",require("./routes/system.routes"));
app.use("/api/v1/suppliers", require("./routes/supplier.routes"));
app.use("/api/v1/inventory", require("./routes/inventory.routes"));

//api route 
app.get("/api", (req, res) => {

    res.json({

        success: true,

        name: "Gloss Pharma ERP",

        version: "1.0.0",

        routes: {
            auth: "/api/v1/auth",
            employees: "/api/v1/employees",
            products: "/api/v1/products",
            suppliers: "/api/v1/suppliers",
            inventory: "/api/v1/inventory",
            purchases: "/api/v1/purchases",
            sales: "/api/v1/sales",
            dashboard: "/api/v1/dashboard",
            reports: "/api/v1/reports",
            documents: "/api/v1/documents",
            ai: "/api/v1/ai",
            invoice: "/api/v1/invoice",
            excel: "/api/v1/excel",
            notifications: "/api/v1/notifications",
            settings: "/api/v1/settings",
            audit: "/api/v1/audit",
            system: "/api/v1/system/info"
        }

    });

});

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