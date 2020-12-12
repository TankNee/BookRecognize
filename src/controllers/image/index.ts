import { NextFunction, Request, Response, Router } from "express";
import { parseUpload, recognizeCharacter, uploadToOSS } from "../../utils/AliyunUtils";

const router = Router();

router.post("/upload", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await parseUpload(req);
        const uploadOSSResult = await Promise.all(
            images.map((image, index) => {
                return uploadToOSS(image.fileName, image.absolutePath);
            })
        );
        const recognizeResult = await Promise.all(
            uploadOSSResult.map((uploadedImage) => {
                var servicePayload = {
                    ImageURL: uploadedImage.url,
                    MinHeight: 10,
                    OutputProbability: true,
                };
                return recognizeCharacter(servicePayload);
            })
        );
        res.send(recognizeResult).end();
    } catch (error) {
        res.send(error).end();
    }
});

export default router;
