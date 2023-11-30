import express from "express";
import openai from "./../config/openai.config.js";
import { handleError } from "./../handlers/errorHandler.js";

const router = express.Router();

router.route("/").get((req, res) => {
    res.status(200).json({ message: "Hello from EDITS ROUTES" });
});

router.route("/:model").post(async (req, res) => {
    
    try {
        const { model } = req.params;
        const { input, instruction } = req.body;
        
        const response = await openai.createEdit({
            model,
            input,
            instruction
        });

        res.status(200).json({
            content: response.data.choices[0].text,
            model: model
        });

    } catch (error) {
        handleError(error, res);
    }
});

export default router;