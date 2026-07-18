require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", (userId) => {
        socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const emitNotification = (event, data) => {
    io.emit(event, data);
};

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server Running on http://localhost:${PORT}`);
        });

        // Check and emit low-stock / expiry alerts on startup
        try {
            const { setEmitNotification, checkAndEmitAlerts } = require("./services/notification.service");
            setEmitNotification(emitNotification);
            setTimeout(async () => {
                await checkAndEmitAlerts();
                console.log("Initial stock alerts checked");
            }, 3000);
        } catch (notifErr) {
            console.log("Notification check skipped:", notifErr.message);
        }
    } catch (error) {
        console.log("Server Failed To Start");
        console.log(error.message);
    }
};

startServer();

module.exports = { io, emitNotification };
