import mongoose, { Schema } from "mongoose";

// This is the model you will be modifying
const projectSchema = new Schema({
  name: {
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    }
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
