import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import guestRoutes from "./routes/guests.js";
import tableRoutes from "./routes/tables.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "Wedding Seating API",
    version: "1.0.0",
  });
});

app.use("/api/guests", guestRoutes);
app.use("/api/tables", tableRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
