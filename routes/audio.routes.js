import express from "express";
import * as fs from "fs";
import openai from "./../config/openai.config.js";
import { handleError } from "./../handlers/errorHandler.js";
import { upload } from "./../handlers/uploadHandlers.js";

const router = express.Router();

let fileName;
let filePath;

router.route("/").get((req, res) => {
    res.status(200).json({ message: "Hello from AUDIO ROUTES" });
});

router.route("/transcription").post(upload.single("upfile"), async (req, res) => {
    const model = "whisper-1";
    
    try {
        const { language } = req.body;
    
        if (!req.file) {
            return res.json({ message: "No file uploaded." });
        }

        fileName = req.file.originalname;
        filePath = `./uploads/${fileName}`;
        
        const response = await openai.createTranscription(
            fs.createReadStream(filePath),
            model,
            language
        );

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });

        res.status(200).json({
            content: response.data.text,
            model: model
        });

    } catch (error) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        handleError(error, res);
    }
});

router.route("/translation").post(upload.single("upfile"), async (req, res) => {
    const model = "whisper-1";

    try {
        if (!req.file) {
            return res.json({ message: "No file uploaded." });
        }
        
        fileName = req.file.originalname;
        filePath = `./uploads/${fileName}`;
        
        const response = await openai.createTranslation(
            fs.createReadStream(filePath),
            model
        );

        
        res.status(200).json({
            content: response.data.text,
            model: model
        });

    } catch (error) {
        handleError(error, res);

    } finally {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
    }
    
});


export default router;