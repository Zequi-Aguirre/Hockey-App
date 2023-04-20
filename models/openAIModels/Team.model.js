const { Schema, model } = require("mongoose");

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
  },
  ownCode: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
  },
  season: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  playersFullTime: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  playersPartTime: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  // this second object adds extra properties: `createdAt` and `updatedAt`
  timestamps: true,
});

const Team = model("Team", teamSchema);

module.exports = Team;
