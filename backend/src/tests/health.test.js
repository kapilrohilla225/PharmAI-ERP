const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.use("/api/v1", require("../src/routes"));

describe("Health Check", () => {
    it("GET /api/v1 should return health check", async () => {
        const res = await request(app).get("/api/v1");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    });
});
