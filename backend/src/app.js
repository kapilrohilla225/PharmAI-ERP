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