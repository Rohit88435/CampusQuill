import uploadOnCloudinary from "../Config/cloudinary.js";
import User from "../Models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    let id = req.userId;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User doesn't found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "get current user error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, userName, headline, location, gender } =
      req.body;
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];
    let profileImage;
    let coverImage;
    if (req.files.profileImage) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        experience,
        education,
        profileImage,
        coverImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user?.toObject ? user.toObject() : user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "updateprofile error" });
  }
};

export const getprofile = async (req, res) => {
  try {
    let { userName } = req.params;

    let user = await User.findOne({ userName }).select("-password");

    if (!user) {
      return res.status(400).json({ message: "userName doesn't exist" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: " get profile error" });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }
    let users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { skills: { $in: query } },
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: " search error" });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    let currentUser = await User.findById(req.userId).select("connection");

    let suggestedUser = await User.find({
      _id: {
        $ne: currentUser,
        $nin: currentUser.connection,
      },
    }).select("-password");

    return res.status(200).json(suggestedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: " suggestedUser error" });
  }
};
