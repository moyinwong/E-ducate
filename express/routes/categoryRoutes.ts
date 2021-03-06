import express from "express";
import { categoryController } from "../main";

export const categoryRoutes = express.Router();

categoryRoutes.get("/:name", categoryController.categoryCourses);
categoryRoutes.get("/others/:name", categoryController.subcategoryCourses);
