const { Router } = require("express");
const ErrorResponse = require("../utils/ErrorResponse");
const { ethers } = require("ethers");
const { usersModel, nonceModel } = require("../database/db");

const userRoutes = Router();

const uniqueUserId = async () => {
  const maxUser = await usersModel.findOne().short({ user_id: -1 }).limit(1);
  const maxUserId = maxUser ? maxUser.user_id : 0;
  return maxUserId + 1;
};

userRoutes.post("/signup", async (req, res, next) => {
  const { wallet_address, username, signature } = req.body;
  if (!wallet_address || !username || !signature)
    return next(new ErrorResponse("Please pass all require data!", 405));
  try {
    const nonce_data = await nonceModel.find({ wallet_address });
    if (!nonce_data || !nonce_data.nonce)
      return next(new ErrorResponse("nonce not found!", 400));
    const nonce = nonce_data.nonce;

    const recoveredAddress = ethers.verifyMessage(nonce.toString(), signature);

    if (
      recoveredAddress.toLocaleLowerCase() !==
      wallet_address.toLocaleLowerCase()
    ) {
      return next(
        new ErrorResponse("Invalid signature! Could not be signup!", 400)
      );
    }

    const existingUser = await usersModel.find({ wallet_address });
    if (existingUser)
      return next(new ErrorResponse("User already registered!", 400));

    await usersModel.create({
      user_id: uniqueUserId(),
      username,
      wallet_address,
    });

    await nonceModel.deleteOne({ wallet_address });

    res.status(200).json("You are signed up successfully.");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ineternal server error", description: error.message });
  }
});

userRoutes.post("/signin", (req, res, next) => {
  res.send("post");
});

userRoutes.post("/nonce", async (req, res, next) => {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address)
      return next(new ErrorResponse("Please pass wallet address!", 400));

    const nonce = Math.floor(Math.random() * 1000000).toString();
    await nonce.create({
      wallet_address,
      nonce,
    });
    res.status(200).json(nonce);
  } catch (error) {
    return next(
      new ErrorResponse("something wents wrong while creating nonce!", 500)
    );
  }
});
module.exports = {
  userRoutes,
};
