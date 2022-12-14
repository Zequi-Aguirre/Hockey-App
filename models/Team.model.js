const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const teamSchema = new Schema(
  {
    cool: {
      type: String,
      // unique: true, // -> Ideally, should be unique, but its up to you
    },
    teamName: {
      type: String,
      // unique: true, // -> Ideally, should be unique, but its up to you
    },
    ownCode: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    joinCode: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    season: {
      type: [{ type: Schema.Types.ObjectId, ref: "Season" }],
    },
    division: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    playersFullTime: {
      type: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    },
    playersPartTime: {
      type: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Team = model("Team", teamSchema);

module.exports = Team;
