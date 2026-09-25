import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },

    destination: {
      type: String,
      default: "",
      index: true,
    },

    source: {
      type: String,
      default: "spotfonder",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeChunk = mongoose.model(
  "KnowledgeChunk",
  knowledgeChunkSchema
);

export default KnowledgeChunk;