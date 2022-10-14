const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const playerSchema = new Schema(
  {
    name: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    lastName: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    phoneNumber: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    emailAddress: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    jerseyNumber: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    joinedTeams: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    },
    User: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // unique: true -> Ideally, should be unique, but its up to you
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Player = model("Player", playerSchema);

module.exports = Player;
