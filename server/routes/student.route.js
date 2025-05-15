import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  login,
  fetchExamQuestions,
  saveAttempt,
} from "../controllers/student.controller.js";

const router = express.Router();

// router.route("/check").get(verifyJWT, authCheck);

// router.route("/signup").post(signup); // or, router.post("/signup", signup);

// EMAIL LOGIN
router.route("/login").post(login);
router.route("/questions/:examId").get(verifyJWT, fetchExamQuestions);
router.route("/answers/save").post(verifyJWT, saveAttempt);

export default router;
