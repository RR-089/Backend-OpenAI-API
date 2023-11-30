import express from "express";
import openai from "./../config/openai.config.js";
import { handleError } from "./../handlers/errorHandler.js";

const router = express.Router();

router.route("/").get((req, res) => {
    res.status(200).json({ message: "Hello from CHAT ROUTES" });
});

router.route("/:model").post(async (req, res) => {
   
    try {
        const { model } = req.params;
        const { prompt } = req.body;

        const messages = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ];

        const response = await openai.createChatCompletion({
            model,
            messages
        });

        res.status(200).json({
            content: response.data.choices[0].message.content,
            model: response.data.model
        });

    } catch (error) {
        handleError(error, res);
    }
});

export default router;