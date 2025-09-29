import express from "express";
const router = express.Router();
import * as userInChatroomControllers from "../controller/user-in-chatroom-controller.js";

router.route("/approveUserInChatroom").post(userInChatroomControllers.approveUserInChatroom);
router.route("/removeUserFromChatroom").post(userInChatroomControllers.removeUserFromChatroom);
router.route("/requestForChatroom").post(userInChatroomControllers.requestForChatroom);

export default router;