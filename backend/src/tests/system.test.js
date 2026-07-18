const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.use("/api/v1/system", require("../src/routes/system.routes"));

describe("System Routes", () => {
    it("GET /api/v1/system/info should return system info", async () => {
        const res = await request(app).get("/api/v1/system/info");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    });
});
