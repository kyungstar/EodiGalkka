import {Router} from "express";
import UserRoutes from "./UserRoutes";

const router = Router();

// 고객 서비스
router.use("/api/user", UserRoutes);


export default router;

