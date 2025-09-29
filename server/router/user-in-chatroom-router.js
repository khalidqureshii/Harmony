import express from "express";
const router = express.Router();
import userInChatroomSchema from "../validators/user-in-chatroom-validator.js";
import validateUserInChatroom from "../middlewares/user-in-chatroom-middleware.js";
import * as userInChatroomControllers from "../controller/user-in-chatroom-controller.js";

router.route("/addUserInChatroom").post(validateUserInChatroom(userInChatroomSchema), userInChatroomControllers.addUserInChatroom);
router.route("/removeUserFromChatroom").post(removeUserFromChatroom);
router.route("/requestForChatroom").post(requestForChatroom);

export default router;