import {Router} from "express";
import UserRoutes from "./UserRoutes";
import FileRoutes from "./FileRoutes";
import TourRoutes from "./TourRoutes";

const router = Router();

// 고객 서비스
router.use("/api/user", UserRoutes);

// 파일 서비스
router.use("/api/file", FileRoutes);

// 투어 서비스
router.use("/api/tour", TourRoutes);

export default router;

