import express from "express";
import openai from "./../config/openai.config.js";
import { handleError } from "./../handlers/errorHandler.js";

const router = express.Router();

router.route("/").get((req, res) => {
    res.status(200).json({ message: "Hello from MODERATIONS ROUTES" });
});

router.route("/:model").post(async (req, res) => {
    
    try {
        const { model } = req.params;
        const { input } = req.body;

        const response = await openai.createModeration({
            model,
            input
        });

        res.status(200).json({
            result: response.data.results,
            model: response.data.model
        });

    } catch (error) {
        handleError(error, res);
    }
});

export default router;  