const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  otp: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  onboardData: [{ type: mongoose.Schema.Types.ObjectId, ref: "Onboard" }],
  assignData: [{ type: mongoose.Schema.Types.ObjectId, ref: "AssignMent" }],
  userPic: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

// token generate
userSchema.methods.generateAuthtoken = async function () {
  try {
    let newtoken = jwt.sign({ _id: this._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save();
    return newtoken;
  } catch (error) {
    res.status(400).json(error);
  }
};

// creating model
const users = new mongoose.model("users", userSchema);

module.exports = users;
