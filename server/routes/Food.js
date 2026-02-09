import express from "express";
import { addProducts, getFoodById, getFoodItems } from "../controllers/Food.js";
import { verifyToken } from "../middleware/verifyUser.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js"; 
import { deleteFood } from "../controllers/Food.js";


const router = express.Router();

router.post("/add", addProducts);
router.get("/", getFoodItems);
router.get("/:id", getFoodById);
router.post("/add", verifyToken, verifyAdmin, addProducts);
router.delete("/:id", verifyToken, verifyAdmin, deleteFood);



export default router;
