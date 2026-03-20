import mongoose, { Schema } from "mongoose";

// This is the model you will be modifying
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    status: {
    type: String,
    enum: ['Pending','In-Progress','Completed'],
    default: 'Pending'
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    }
});

const Task = mongoose.model("Task", taskSchema);

export default Task;