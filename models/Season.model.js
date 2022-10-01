const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const seasonSchema = new Schema(
  {
    seasonName: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    schedule: {
      type: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Season = model("Season", seasonSchema);

module.exports = Season;
