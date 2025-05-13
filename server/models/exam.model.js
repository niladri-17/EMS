import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed'],
    default: 'draft',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // admin
    required: true,
  }
}, {
  timestamps: true,
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
