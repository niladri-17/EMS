import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Exam from "../models/exam.model.js";
import ExamAttempt from "../models/examAttempt.model.js";
import Question from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const options = {
  httpOnly: true, // This cookie cannot be accessed by client side javascript
  secure: true, // This cookie can only be sent over https
  sameSite: "none", // This cookie will be sent with cross-origin requests
};

const generateAccessAndRefereshTokens = async (user, session = null) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ session, validateBeforeSave: false }); // Save inside transaction // Don't validate every fields again before save

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Register student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = asyncHandler(async (req, res) => {
  const { examCode, emailId } = req.body;
  const examId = req.params.examId;

  // 1. Validate the student by email
  const student = await User.findOne({ email: emailId, role: "student" });
  if (!student) {
    throw new ApiError(404, "Student with this email not found.");
  }

  const studentId = student._id;

  // 2. Check if the exam exists
  const exam = await Exam.findById(examId);
  if (!exam) {
    throw new ApiError(404, "Exam not found.");
  }

  // 3. Ensure the exam is not cancelled
  if (exam.result === "cancelled") {
    throw new ApiError(400, "This exam has been cancelled.");
  }

  // 4. Ensure the exam's end date has not passed
  const currentTime = new Date();
  if (exam.endDate < currentTime) {
    throw new ApiError(400, "The exam has already ended.");
  }

  // 6. Verify the exam code for the student
  const isEnrolled = await ExamAttempt.findOne({
    exam: examId,
    student: studentId,
  });

  if (!isEnrolled) {
    throw new ApiError(400, "You are not enrolled in this exam.");
  }

  const examAttempt = await ExamAttempt.findOne({
    exam: examId,
    student: studentId,
    code: examCode,
  });

  if (!examAttempt) {
    throw new ApiError(400, "Invalid exam code.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    student
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// View published & active exams
export const getAvailableExams = async (req, res) => {
  try {
    const now = new Date();

    const exams = await Exam.find({
      status: "published",
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).select("-questions");

    res.json({ exams });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Start exam attempt
export const startExamAttempt = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.user.id;

    // Check if attempt already exists
    const existingAttempt = await ExamAttempt.findOne({
      exam: examId,
      student: studentId,
    });
    if (existingAttempt)
      return res.status(400).json({ message: "Attempt already exists" });

    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const attempt = new ExamAttempt({
      student: studentId,
      exam: examId,
      status: "in-progress",
      startedAt: new Date(),
    });

    await attempt.save();
    res.status(201).json({ message: "Exam started", attemptId: attempt._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Submit exam attempt
export const submitExamAttempt = async (req, res) => {
  try {
    const { attemptId, answers } = req.body;

    const attempt = await ExamAttempt.findById(attemptId).populate("exam");
    if (!attempt || attempt.status !== "in-progress") {
      return res
        .status(400)
        .json({ message: "Invalid attempt or already submitted" });
    }

    const questionDocs = await Question.find({ exam: attempt.exam._id });
    let totalScore = 0;
    const evaluatedAnswers = answers.map((answer) => {
      const question = questionDocs.find(
        (q) => q._id.toString() === answer.questionId
      );
      const isCorrect = question?.correctAnswer === answer.selectedOption;
      const marks = isCorrect ? question.marks : 0;
      totalScore += marks;
      return {
        question: question._id,
        selectedOption: answer.selectedOption,
        isCorrect,
        marksObtained: marks,
      };
    });

    attempt.answers = evaluatedAnswers;
    attempt.score = totalScore;
    attempt.status = "submitted";
    attempt.completedAt = new Date();

    // Simple pass/fail rule: 50% passing score
    const passingScore = questionDocs.reduce((a, q) => a + q.marks, 0) * 0.5;
    attempt.result = totalScore >= passingScore ? "pass" : "fail";

    await attempt.save();

    res.json({
      message: "Exam submitted successfully",
      score: totalScore,
      result: attempt.result,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// View result
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await ExamAttempt.find({ student: req.user.id })
      .populate("exam", "title duration")
      .sort({ createdAt: -1 });

    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const fetchQuestions = asyncHandler(async (req, res) => {
  const { examId } = req.params; // Exam ID passed as a URL parameter

  // Fetch random questions for the particular exam, ensuring no repeats
  const questions = await Question.aggregate([
    { $match: { exam: new mongoose.Types.ObjectId(examId) } }, // Match questions for the specific exam
    { $sample: { size: 10 } }, // Randomly select 10 questions (you can adjust size)
  ]);

  if (questions.length === 0) {
    throw new ApiError(404, "No questions found for this exam.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Questions fetched successfully"));
});
