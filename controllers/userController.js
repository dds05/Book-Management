const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  const ifuserExist = await User.findOne({ email });
  if (ifuserExist) {
    res.status(400);
    throw new Error("User already exists!");
  }


  const user = await User.create({
    email,
    password,
    name,
  });
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token:generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Some Error Occured");
  }
});


const authenticateUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findUser=await User.findOne({email});
    if(findUser && (await findUser.matchPassword(password))){
        res.json({
            _id:findUser._id,
            name:findUser.name,
            email:findUser.email,
            isAdmin:findUser.isAdmin,
            token:generateToken(findUser._id)
        })
    }
    else{
        res.status(400);
        throw new Error(`Invalid Email or Password`)
    }
 
  });

module.exports = { registerUser,authenticateUser };
