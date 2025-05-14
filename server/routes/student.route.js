import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  login,
  fetchExamQuestions,
} from "../controllers/student.controller.js";

const router = express.Router();

// router.route("/check").get(verifyJWT, authCheck);

// router.route("/signup").post(signup); // or, router.post("/signup", signup);

// EMAIL LOGIN
router.route("/login/:examId").post(login);
router.route("/questions/:examId").get(verifyJWT, fetchExamQuestions);

export default router;
