import { generateChatAI } from "../services/chatAIService.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    console.log(`💬 Chat request: ${message}`);

    const result = await generateChatAI(message.trim(), history);

    return res.json({
      success: true,
      type: result.type || "text",
      answer: result.answer || "",
      photos: result.photos || [],
    });
  } catch (error) {
    console.error("❌ Chat Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process chat request.",
    });
  }
};