import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token = await req.cookies.token;
    // Check if the token exists and is a string
    if (!token) {
      return res.status(400).json({ message: "your token doesn't exist" });
    }
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res.status(400).json({ message: "your account not verify" });
    }

    req.userId = verifyToken.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "is Auth error " });
  }
};

export default isAuth;
