import Canvas from "../models/canvas.model.js";

export const createCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.create({
      title: req.body.title || "Untitled",
      userId: req.user._id,
      elements: []
    });

    res.status(201).json({
      success: true,
      canvas
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating canvas" });
  }
};

export const getUserCanvases = async (req, res) => {
  try {
    const canvases = await Canvas.find({ userId: req.user._id })
      .select("title updatedAt createdAt");

    res.json({
      success: true,
      canvases
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching canvases" });
  }
};

export const getCanvasById = async (req, res) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      success: true,
      canvas
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching canvas" });
  }
};

export const updateCanvas = async (req, res) => {
  try {
    const { title } = req.body;

    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    canvas.title = title || canvas.title;

    await canvas.save();

    res.json({
      success: true,
      canvas
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating canvas" });
  }
};

export const updateCanvasElements = async (req, res) => {
  try {
    const { elements } = req.body;

    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    canvas.elements = elements;

    await canvas.save();

    res.json({
      success: true,
      canvas
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating elements" });
  }
};

export const deleteCanvas = async (req, res) => {
  try {
    const canvas = await Canvas.findById(req.params.id);

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await canvas.deleteOne();

    res.json({
      success: true,
      message: "Canvas deleted"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting canvas" });
  }
};

export const deleteElement = async (req, res) => {
  try {
    const { canvasId, elementId } = req.params;

    const canvas = await Canvas.findById(canvasId);

    if (!canvas) {
      return res.status(404).json({ message: "Canvas not found" });
    }

    if (canvas.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const element = canvas.elements.id(elementId);

    if (!element) {
      return res.status(404).json({ message: "Element not found" });
    }

    element.isDeleted = true;

    await canvas.save();

    res.json({
      success: true,
      message: "Element deleted",
      element
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting element" });
  }
};

