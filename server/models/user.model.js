import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    }, // Optional for email users
    password: {
      type: String,
      minlength: 6,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "student"],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("Either email or phone number must be provided"));
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
