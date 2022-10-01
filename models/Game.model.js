const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const gameSchema = new Schema(
  {
    homeTeam: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },
    date: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    time: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    location: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    division: {
      type: String,
      // unique: true // -> Ideally, should be unique, but its up to you
    },
    season: {
      type: [{ type: Schema.Types.ObjectId, ref: "Season" }],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
