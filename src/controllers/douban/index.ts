import { NextFunction, Request, Response, Router } from "express";
import { crawlDoubanRate } from "../../utils/DoubanUtils";
const router = Router();

router.get("/info", async (req: Request, res: Response, next: NextFunction) => {
    const { bookName } = req.query;

    const result = await crawlDoubanRate(bookName);
    res.json(result);
});

export default router;
