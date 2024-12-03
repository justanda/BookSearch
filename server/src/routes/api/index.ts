import express from "express";
const router = express.Router();
import userRoutes from "./user-routes";

router.use("/users", userRoutes);

export default router;
