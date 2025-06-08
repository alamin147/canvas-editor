import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    canvasData: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: "#f8f9fa",
    },
    width: {
      type: Number,
      default: 1400,
    },
    height: {
      type: Number,
      default: 600,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    lastEdited: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
