import { NextFunction, Request, Response, Router } from "express";
import { parseUpload, recognizeCharacter, uploadToOSS } from "../../utils/AliyunUtils";

const router = Router();

router.post("/upload", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await parseUpload(req);
        const uploadOSSResults = await Promise.all(
            images.map((image, index) => {
                return uploadToOSS(image.fileName, image.absolutePath);
            })
        );
        const result = uploadOSSResults.map((uor, i) => {
            return {
                ...uor,
                dimensions: images[i].dimensions,
            };
        });
        res.send(result).end();
    } catch (error) {
        res.send(error).end();
    }
});
router.get("/recognization", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { imageOSSUrl } = req.query;
        const servicePayload = {
            ImageURL: imageOSSUrl,
            MinHeight: 10,
            OutputProbability: true,
        };
        const recognizeResult = await recognizeCharacter(servicePayload);
        res.send(recognizeResult).end();
    } catch (error) {
        res.send(error).end();
    }
});

export default router;
