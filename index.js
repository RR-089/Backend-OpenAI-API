import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import {
    audioRoutes,
    imagesRoutes,
    chatRoutes,
    completionsRoutes,
    editRoutes,
    moderationsRoutes
} from "./routes/index.js";

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan(":method :url :status :response-time ms"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/openai-audio", audioRoutes);
app.use("/openai-images", imagesRoutes);
app.use("/openai-chat", chatRoutes);
app.use("/openai-completions", completionsRoutes);
app.use("/openai-edit", editRoutes);
app.use("/openai-moderations", moderationsRoutes);

app.get("/", (req, res) => {
    res.json({message: "Hi, this is backend"});
});

app.use((req, res) => {
    res.status(404).json({ message: "Page Not Found" });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
