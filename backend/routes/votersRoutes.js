const { Router } = require("express");
const { votesRequestsModel, usersModel } = require("../database/db");
const { userMiddleware } = require("../middlewares/userMiddleware");
const voterRoutes = Router();

async function uniqueVoterReqId() {
  const maxUser = await votesRequestsModel
    .findOne()
    .sort({ req_id: -1 })
    .limit(1);
  const maxUserId = maxUser ? maxUser.req_id : 0; // Default to 0 if no users exist
  return maxUserId + 1;
}

voterRoutes.post("/create", userMiddleware, async (req, res, next) => {
  const { elec_id } = req.body();
  if (!elec_id)
    return next(new ErrorResponse("Please pass the election id!", 400));
  const wallet_address = req.walletAddress;
  const { user_id } = await usersModel.findOne({ wallet_address });
  if (!user_id) return next(new ErrorResponse("Unable to get user id!", 400));
  const voterReqRes = await votesRequestsModel.create({
    req_id: await uniqueVoterReqId(),
    user_id,
    elec_id,
    wallet_address,
  });
  res.status(200).json({ message: "Success!", voterReqRes });
});

module.exports = {
  voterRoutes,
};
