//player schema
const { Schema, model } = require("mongoose");
const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    jerseyNumber: {
      type: String,
      required: true,
    },
    joinedTeams: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  // this second object adds extra properties: `createdAt` and `updatedAt`
  { timestamps: true }
);

const Player = model("Player", playerSchema);

module.exports = Player;
