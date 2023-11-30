import express from "express";
import * as fs from "fs";
import openai from "./../config/openai.config.js";
import { handleError } from "./../handlers/errorHandler.js";
import { upload } from "./../handlers/uploadHandlers.js";

const router = express.Router();

let fileName;
let filePath;

router.route("/").get((req, res) => {
    res.status(200).json({ message: "Hello from IMAGES ROUTES" });
});

router.route("/create").post(async (req, res) => {
    
    try {
        const { prompt, size } = req.body;
        const response = await openai.createImage({
            prompt,
            size
        });

        res.status(200).json({
            image: response.data.data[0].url
        });

    } catch (error) {
        handleError(error, res);
    }
});

router.route("/edit").post(upload.single("upfile"), async (req, res) => {
    
    try {
        const { prompt, size } = req.body;

        fileName = req.file.originalname;
        filePath = `./uploads/${fileName}`;

        const response = await openai.createImageEdit(
            fs.createReadStream(filePath),
            prompt,
            size
        );

        res.status(200).json({
            image: response.data.data[0].url
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

router.route("/variation").post(upload.single("upfile"), async (req, res) => {
    const n = 1;
    
    try {
        const { size } = req.body;

        fileName = req.file.originalname;
        filePath = `./uploads/${fileName}`;

        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            n,
            size
        );
 
        res.status(200).json({
            image: response.data.data[0].url
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