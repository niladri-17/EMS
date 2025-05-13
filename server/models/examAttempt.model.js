import mongoose from 'mongoose';

const examAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  examCode: {
    type: String,
    required: true,  // This is the unique code
    unique: true,    // Ensure the code is unique per attempt
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    selectedOption: String,
    isCorrect: Boolean,
    marksObtained: {
      type: Number,
      default: 0,
    }
  }],
  score: {
    type: Number,
    default: 0,
  },
  permissionAccepted: {
    type: Boolean,
    default: false,
  },
  proctoring: {
    type: Map,
    of: String, // e.g., { "00:01:30": "face not detected" }
    default: {},
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'submitted', 'reviewed'],
    default: 'pending',
  },
  result: {
    type: String,
    enum: ['passed', 'failed', 'cancelled', 'not-evaluated'],
    default: 'not-evaluated',
  },
  startedAt: Date,
  completedAt: Date,
}, {
  timestamps: true,
});

const ExamAttempt = mongoose.model('ExamAttempt', examAttemptSchema);
export default ExamAttempt;
