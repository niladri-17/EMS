import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Exam from "../models/exam.model.js";
import ExamAttempt from "../models/examAttempt.model.js";
import Question from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

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
  const { examCode, emailId, examId } = req.body;

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
    examCode: examCode,
  });

  if (!examAttempt) {
    throw new ApiError(400, "Invalid exam code.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    student
  );

  const loggedInUser = await User.findById(student._id).select(
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
          examAttemptId: examAttempt._id,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

export const saveAttempt = async (req, res) => {
  try {
    const { examAttemptId, answers } = req.body;

    // Validate input
    if (!examAttemptId) {
      return res.status(400).json({ message: "examAttemptId is required" });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res
        .status(400)
        .json({ message: "answers array is required and cannot be empty" });
    }

    // Find the exam attempt
    const examAttempt = await ExamAttempt.findById(examAttemptId);
    if (!examAttempt) {
      return res.status(404).json({ message: "Exam attempt not found" });
    }

    // Process each answer
    const processedAnswers = [];

    for (const answer of answers) {
      // Validate each answer
      if (!answer.question || !answer.selectedOption) {
        return res.status(400).json({
          message:
            "Each answer must contain question and selectedOption fields",
        });
      }

      // Find the question to check if the answer is correct
      const question = await Question.findById(answer.question);
      if (!question) {
        return res.status(404).json({
          message: `Question with ID ${answer.question} not found`,
        });
      }

      // Determine if the answer is correct and calculate marks
      const isCorrect = question.correctOption === answer.selectedOption;
      const marksObtained = isCorrect ? question.marks || 0 : 0;

      // Create the answer object
      processedAnswers.push({
        question: answer.question,
        selectedOption: answer.selectedOption,
        isCorrect,
        marksObtained,
      });
    }

    // Update the exam attempt with the new answers
    examAttempt.answers = processedAnswers;

    // Recalculate total marks
    examAttempt.totalMarksObtained = processedAnswers.reduce(
      (total, answer) => total + answer.marksObtained,
      0
    );

    // Save the updated exam attempt
    await examAttempt.save();

    return res.status(200).json({
      message: "Answers saved successfully",
      examAttempt,
    });
  } catch (error) {
    console.error("Error saving answers:", error);
    return res.status(500).json({
      message: "Failed to save answers",
      error: error.message,
    });
  }
};

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

export const fetchExamQuestions = asyncHandler(async (req, res) => {
  const { examId } = req.params; // Exam ID passed as a URL parameter
  const studentId = req.user._id; // Assuming you have authenticated user in req.user

  // First check if there's an in-progress attempt for this student and exam
  const existingAttempt = await ExamAttempt.findOne({
    student: studentId,
    exam: examId,
    status: "in-progress",
  }).lean();

  let questions = [];
  let attemptId = null;

  // If there's an in-progress attempt
  if (existingAttempt) {
    attemptId = existingAttempt._id;

    // 1. Fetch random questions from the Question schema using examId
    questions = await Question.aggregate([
      { $match: { exam: new mongoose.Types.ObjectId(examId) } },
    ]);

    questions = shuffleArray([...questions]); // Shuffle the questions to randomize order

    // 2. Get answered questions from the attempt
    const answeredQuestions = existingAttempt.answers || [];

    // 3. Map answers to questions - add selectedOption to each question if it was answered
    questions = questions.map((question) => {
      // Find if this question has an answer in the existing attempt
      const answer = answeredQuestions.find(
        (ans) => ans.question.toString() === question._id.toString()
      );

      // Add selectedOption to the question object
      return {
        id: question._id,
        question: question.questionText,
        options: question.options,
        selectedOption: answer ? answer.selectedOption : null,
      };
    });
  } else {
    // No in-progress attempt, fetch random questions
    questions = await Question.aggregate([
      { $match: { exam: new mongoose.Types.ObjectId(examId) } },
    ]);

    questions = shuffleArray([...questions]);

    // Format questions to include null selectedOption
    questions = questions.map((question) => ({
      id: question._id,
      question: question.questionText,
      options: question.options,
      selectedOption: null,
    }));
  }

  if (questions.length === 0) {
    throw new ApiError(404, "No questions found for this exam.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Questions fetched successfully"));
});

// Helper function to generate a unique exam code
function generateUniqueExamCode() {
  // Generate a random 6-character alphanumeric code
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }

  // Add a timestamp component to ensure uniqueness
  const timestamp = Date.now().toString(36).slice(-4);
  return `${code}-${timestamp}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
}

// first check in the exam attempt if the exam is in progress or not
// if yes then fetch the answers which has question._id and selectedOption
//    fetch random questions from the question schema using the examId without repeating
//    add the selectedOption to the question object
// if no then fetch random questions from the question schema using the examId without repeating
