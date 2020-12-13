import { NextFunction, Request, Response, Router } from "express";
import { crawlDoubanRate } from "../../utils/DoubanUtils";
const router = Router();

// 进入回调函数
router.get("/info", async (req: Request, res: Response, next: NextFunction) => {
    const { bookName } = req.query;

    const result = await crawlDoubanRate(bookName);
    res.json(result);
});

export default router;
