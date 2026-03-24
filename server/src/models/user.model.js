import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  { _id: false }
);

const boundElementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String }
  },
  { _id: false }
);

const elementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "line",
        "polyline",
        "rectangle",
        "ellipse",
        "diamond",
        "arrow",
        "text",
        "freehand",
        "image"
      ],
      required: true
    },

    x: { type: Number, required: true },
    y: { type: Number, required: true },

    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },

    angle: { type: Number, default: 0 },

    points: [pointSchema],

    strokeColor: { type: String, default: "#000000" },
    backgroundColor: { type: String, default: "transparent" },
    fillStyle: {
      type: String,
      enum: ["solid", "hachure", "cross-hatch"],
      default: "solid"
    },

    strokeWidth: { type: Number, default: 1 },
    strokeStyle: {
      type: String,
      enum: ["solid", "dashed", "dotted"],
      default: "solid"
    },

    roughness: { type: Number, default: 1 },
    opacity: { type: Number, default: 100 },

    text: { type: String },
    fontSize: { type: Number },
    fontFamily: { type: Number },
    textAlign: {
      type: String,
      enum: ["left", "center", "right"]
    },
    verticalAlign: {
      type: String,
      enum: ["top", "middle", "bottom"]
    },

    startBinding: boundElementSchema,
    endBinding: boundElementSchema,

    groupIds: [{ type: String }],

    isDeleted: { type: Boolean, default: false },

    version: { type: Number, default: 1 },
    versionNonce: { type: Number, default: 0 },

    updated: { type: Number },

    seed: { type: Number },

    fileId: { type: String },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const canvasSchema = new mongoose.Schema(
  {
    title: { type: String },

    elements: [elementSchema],

    appState: {
      viewBackgroundColor: { type: String, default: "#ffffff" },
      gridSize: { type: Number, default: null },
      zoom: { type: Number, default: 1 },
      scrollX: { type: Number, default: 0 },
      scrollY: { type: Number, default: 0 }
    },

    collaborators: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        socketId: String,
        username: String
      }
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Canvas", canvasSchema);