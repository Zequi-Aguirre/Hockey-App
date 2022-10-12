const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    lastname: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    phonenumber: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    player: {
      type: Boolean,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    manager: {
      type: Boolean,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    email: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: String,
    joinedTeams: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    },
    ownedTeams: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    },
    admin: {
      type: Boolean,
      // unique: true -> Ideally, should be unique, but its up to you
    },
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
