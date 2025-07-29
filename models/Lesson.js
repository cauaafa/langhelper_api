const mongoose = require("mongoose");
const { Schema } = mongoose;

const lessonSchema = new Schema(
  {
    name: String,
    exercises: [
      {
        type: {
          type: String,
          enum: ["explanation", "question"],
          default: "explanation",
        },
        text: String,
        image: String,
        answerIndex: { type: String, default: null },
        options: [
          {
            text: String,
            image: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
