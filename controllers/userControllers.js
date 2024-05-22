const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const Skill = require("../models/signupSchema");
const Onboard = require("../models/onBoardSchema");
const assign = require("../models/AssignmentSchema");
const bcrypt = require("bcrypt");
const multer = require("multer");
const Image = require("../models/ImageSchema");
const fs = require("fs");
// email config
const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.userregister = async (req, res) => {
  const { fname, email, password, otp, phone } = req.body;

  if (!fname || !email || !password || !otp || !phone) {
    res.status(400).json({ error: "Please Enter All Input Data" });
  }

  try {
    const presuer = await users.findOne({ email: email });

    if (presuer) {
      res.status(400).json({ error: "This User Allready exist in our db" });
    } else {
      const userregister = new users({
        fname,
        email,
        password,
        otp,
        phone,
      });

      // here password hasing

      const storeData = await userregister.save();
      res.status(200).json(storeData);
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

// user send otp
exports.userOtpSend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Please Enter Your Email" });
  }

  try {
    const OTP = Math.floor(100000 + Math.random() * 900000);

    const existEmail = await userotp.findOne({ email: email });

    if (existEmail) {
      const updateData = await userotp.findByIdAndUpdate(
        { _id: existEmail._id },
        {
          otp: OTP,
        },
        { new: true }
      );
      await updateData.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending Eamil For Otp Validation",
        text: `OTP:- ${OTP}`,
      };

      tarnsporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(400).json({ error: "email not send" });
        } else {
          console.log("Email sent", info.response);
          res.status(200).json({ message: "Email sent Successfully" });
        }
      });
    } else {
      const saveOtpData = new userotp({
        email,
        otp: OTP,
      });

      await saveOtpData.save();
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending Eamil For Otp Validation",
        text: `OTP:- ${OTP}`,
      };

      tarnsporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(400).json({ error: "email not send" });
        } else {
          console.log("Email sent", info.response);
          res.status(200).json({ message: "Email sent Successfully" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.userOtpVerify = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and email" });
  }

  try {
    const otpverification = await userotp.findOne({ email: email });

    if (otpverification.otp === otp) {
      const preuser = await users.findOne({ email: email });

      res.status(200).json({ message: "Correct otp!!!!" });
    } else {
      res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const userValid = await users.findOne({ email: email });
    console.log(userValid);

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: "invalid details" });
      } else {
        // token generate
        const token = await userValid.generateAuthtoken();

        // cookiegenerate
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };
        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {
    res.status(401).json(error);
    console.log("catch block");
  }
};

exports.signup = async (req, res) => {
  try {
    const user = await users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract skill data from request body
    const skillData = req.body;

    // Create a new skill using the skill data
    const skill = new Skill(skillData);

    // Save the skill
    await skill.save();

    // Associate skill with user
    user.skills.push(skill);
    await user.save();

    res.status(201).json(skill); // Return the created skill
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.onBoard = async (req, res) => {
  try {
    const user = await users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract skill data from request body
    const OnboardData = req.body;

    // Create a new skill using the skill data
    const data = new Onboard(OnboardData);

    // Save the skill
    await data.save();

    // Associate skill with user
    user.onboardData.push(data);
    await user.save();

    res.status(201).json(data); // Return the created skill
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.assigDetails = async (req, res) => {
  try {
    const user = await users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const AssignData = req.body;

    const data = new assign(AssignData);

    await data.save();

    user.assignData.push(data);
    await user.save();

    res.status(201).json(data); // Return the created skill
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.UploadImage = async (req, res) => {
  try {
    const user = await users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const image = new Image({
      name: req.file.originalname,
      data: fs.readFileSync(req.file.path),
    });

    await image.save();

    user.userPic.push(image);
    await user.save();

    res.status(201).send("Image uploaded successfully"); // Return the created skill
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.GetProfileImages = async (req, res) => {
  try {
    const user = await users.findById(req.params.userId).populate("userPic");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const images = user.userPic.map((img) => ({
      id: img._id,
      name: img.name,
      data: img.data.toString("base64"), // Convert binary data to base64
    }));

    res.status(200).json(images);
  } catch (err) {
    res.status(500).send(err.message);
  }
};