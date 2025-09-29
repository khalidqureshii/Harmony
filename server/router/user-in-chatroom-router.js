import express from "express";
const router = express.Router();
import * as userInChatroomControllers from "../controller/user-in-chatroom-controller.js";

router.route("/addUserInChatroom").post(userInChatroomControllers.addUserInChatroom);
router.route("/removeUserFromChatroom").post(removeUserFromChatroom);
router.route("/requestForChatroom").post(requestForChatroom);

export default router;