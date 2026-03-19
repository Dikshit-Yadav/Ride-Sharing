const User = require("../models/User")
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

exports.uploadProfilePic = (req, res) => {
    upload.single("profilePic")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        try {
            const user = await User.findByIdAndUpdate(req.user.id, { profilePic: req.file.filename }, { new: true });
            res.status(200).json({ message: "profile pic uploaded", user });
            // console.log(user)
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
}

exports.getProfilePic = (req, res) => {
    const { filename } = req.params;
    // console.log(filename)
    if (!filename) {
        return res.status(400).json({ message: "Filename not provided." });
    }
    const profilePicPath = path.join(__dirname, "../uploads", filename);
    if (!fs.existsSync(profilePicPath)) {
        return res.status(404).json({ message: "Profile picture not found" });
    }
    res.sendFile(profilePicPath);
}
exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            user,
            profilePic: user.profilePic
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, newPassword, oldPassword } = req.body;

        const updateData = { name, email, phone };

        if (newPassword && oldPassword) {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "user not found" });
            }
            if (user.password !== oldPassword) {
                return res.status(400).json({ message: "invalid old password" });
            }
            updateData.password = newPassword;
        } else if (newPassword && !oldPassword) {
            return res.status(400).json({ message: "old password is required to a new password" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}