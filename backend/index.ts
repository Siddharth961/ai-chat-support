import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from 'morgan'
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));  // rejects huge payloads

app.use(morgan("dev"));

app.use("/chat", chatRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));