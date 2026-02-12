const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const alreadyUser = await User.findOne({ email });
    if (alreadyUser)
      return res.status(400).json({ message: " Already user register." });

    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.password !== password)

      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {  
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp)
    user.resetOTP = otp;
    
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      to: email,
      subject: "password reset OTP",
      text: `your otp is ${otp}`
    });

    res.json({ message: "otp sent on email" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;
    console.log(email)
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "user not found" });

    if (user.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.resetOTP == otp) {
      user.password = newPassword;
      user.resetOTP = null;
      user.resetOTPExpiry = null
      await user.save();
      tempmail = null;
      res.json({ message: "password reset successful" });
    } else {
      return res.status(400).json({ message: "invalid  OTP" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
