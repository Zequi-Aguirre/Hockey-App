const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    homeTeam: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    },
    awayTeam: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    },
    dateTime: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    location: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
