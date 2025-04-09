const { Router } = require("express");
const { votesRequestsModel, usersModel } = require("../database/db");
const { userMiddleware } = require("../middlewares/userMiddleware");
const ErrorResponse = require("../utils/ErrorResponse");

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
  try {
    const { elec_id } = req.body;
    if (elec_id === null)
      return next(new ErrorResponse("Please pass the election id!", 400));
    const wallet_address = req.wallet_address;
    const userResponse = await usersModel.findOne({ wallet_address });
    const { user_id, username } = userResponse;
    if (!user_id) return next(new ErrorResponse("Unable to get user id!", 400));
    const voterReqRes = await votesRequestsModel.create({
      req_id: await uniqueVoterReqId(),
      user_id,
      username,
      elec_id,
      wallet_address,
    });
    res.status(200).json({ message: "Success!", voterReqRes });
  } catch (error) {
    res.status(500).json(error);
  }
});

voterRoutes.get("/get/:election_id", userMiddleware, async (req, res, next) => {
  const elec_id = req.params.election_id;
  if (elec_id === null)
    return next(new ErrorResponse("Please pass the election id!", 400));
  const wallet_address = req.wallet_address;
  const userResponse = await usersModel.findOne({ wallet_address });
  const user_id = userResponse.user_id;
  if (!user_id) return next(new ErrorResponse("Unable to get user id!", 400));
  const voterReqRes = await votesRequestsModel.findOne({
    wallet_address,
    elec_id,
    user_id,
  });
  res.send(voterReqRes);
});

voterRoutes.get("/getVoters/:election_id", async (req, res, next) => {
  const elec_id = req.params.election_id;
  if (elec_id === null)
    return next(new ErrorResponse("Please pass the election id!", 400));

  try {
    const voterReqRes = await votesRequestsModel.find({ elec_id });
    if (!voterReqRes) {
      return res
        .status(404)
        .send({ message: "No voters found for this election." });
    }

    res.send(voterReqRes); // Send only the voters array
  } catch (error) {
    return next(error);
  }
});

voterRoutes.put("/updateStatus/", async (req, res, next) => {
  // const elec_id = req.params.election_id;
  const { elec_id, status, user_id } = req.body;
  if (elec_id === null || user_id === null || status == "")
    return next(new ErrorResponse("Please pass the election id!", 400));

  try {
    const voterReqRes = await votesRequestsModel.findOne({
      elec_id, user_id
    });

    if (!voterReqRes) {
      return res.status(404).send({ message: "Voter request not found." });
    }

    if (voterReqRes.elec_id !== elec_id || voterReqRes.user_id !== user_id) {
      return res
        .status(400)
        .send({ message: "Election ID or User ID does not match." });
    }

    voterReqRes.status = status;
    await voterReqRes.save();

    res.send(voterReqRes);
  } catch (error) {
    return next(error);
  }
});

module.exports = {
  voterRoutes,
};
