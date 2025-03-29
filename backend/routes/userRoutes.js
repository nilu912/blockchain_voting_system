const { Router } = require("express");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const { ethers } = require("ethers");
const { usersModel, nonceModel } = require("../database/db");

const userRoutes = Router();

async function uniqueUserId() {
  const maxUser = await usersModel.findOne().sort({ user_id: -1 }).limit(1);
  const maxUserId = maxUser ? maxUser.user_id : 0; // Default to 0 if no users exist
  return maxUserId + 1;
}

userRoutes.post("/signup", async (req, res, next) => {
  const { wallet_address, username, signature } = req.body;
  if (!wallet_address || !username || !signature)
    return next(new ErrorResponse("Please pass all require data!", 405));
  try {
    const nonce_data = await nonceModel.findOne({ wallet_address });
    await nonceModel.deleteOne({ wallet_address });

    if (!nonce_data || !nonce_data.nonce)
      return next(new ErrorResponse("nonce not found!", 400));
    const nonce = nonce_data.nonce;
    const recoveredAddress = ethers.verifyMessage(nonce.toString(), signature);

    if (recoveredAddress.toLowerCase() !== wallet_address.toLowerCase()) {
      return next(
        new ErrorResponse("Invalid signature! Could not be signup!", 400)
      );
    }

    const existingUser = await usersModel.findOne({ wallet_address });
    if (existingUser)
      return next(new ErrorResponse("User already registered!", 400));
    const user_id = await uniqueUserId();
    const userResponse = await usersModel.create({
      user_id,
      username,
      wallet_address,
    });
    if (!userResponse) {
      return res.status(404).json({ error: "User not created!" });
    }
    console.log("User Signup successfully!");
    res
      .status(200)
      .json({ message: "You are signed up successfully.", userResponse });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ineternal server error", description: error.message });
  }
});

userRoutes.post("/signin", async (req, res, next) => {
  const { wallet_address, signature } = req.body;
  if (!wallet_address || !signature)
    return next(new ErrorResponse("please pass require fields!", 400));

  const { nonce } = await nonceModel.findOne({ wallet_address });
  if (!nonce) return next(new ErrorResponse("nonce value not found!", 400));
  // const nonce = nonce_data.nonce;
  await nonceModel.deleteOne({ wallet_address });

  const user = await usersModel.findOne({ wallet_address });
  if (!user) return next(new ErrorResponse("user not registered!"));

  const recoveredAddress = ethers.verifyMessage(nonce.toString(), signature);

  if (
    recoveredAddress.toLocaleLowerCase() !== wallet_address.toLocaleLowerCase()
  )
    return next(new ErrorResponse("Invalid signature!", 400));

  const token = jwt.sign({ wallet_address }, process.env.JWT_SECRET);
  console.log("user signin!");
  res.status(200).json({token});
});

userRoutes.get("/user/:wallet_address", async (req, res, next) => {
  try {
    const { wallet_address } = req.params;

    if (!wallet_address) {
      return res.status(400).json({ error: "Please pass wallet address!" });
    }

    const userResponse = await usersModel.findOne({ wallet_address });

    if (!userResponse) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json(userResponse);
  } catch (error) {
    console.error("Server Error:", error.message);
    res.status(500).json({
      error: "Something went wrong while getting user!",
      description: error.message,
    });
  }
});

userRoutes.post("/create_nonce", async (req, res, next) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address)
      return next(new ErrorResponse("Please pass wallet address!", 400));

    const nonce = Math.floor(Math.random() * 1000000).toString();
    const nonce_data = await nonceModel.create({
      wallet_address,
      nonce,
    });
    res.status(200).json({ nonce });
  } catch (error) {
    return next(
      new ErrorResponse("something wents wrong while creating nonce!", 500)
    );
  }
});
userRoutes.get("/get_nonce/:wallet_address", async (req, res, next) => {
  const wallet_address = req.params.wallet_address;
  if (!wallet_address)
    return next(new ErrorResponse("Please pass the wallet address!", 400));
  const nonce_data = await nonceModel.findOne({ wallet_address });
  if (!nonce_data.nonce)
    return next(new ErrorResponse("Please nonce not found!", 400));
  res.json({ nonce });
});
module.exports = {
  userRoutes,
};
