import mongoose from "mongoose";

const elementSchema = new mongoose.Schema({
  type: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  text: String,
  points: Array,
  strokeColor: String
});

const canvasSchema = new mongoose.Schema({
  boardId: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  elements: [elementSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Canvas = mongoose.model("canvas", canvasSchema);

export default Canvas;