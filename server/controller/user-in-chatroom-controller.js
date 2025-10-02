import Chatroom from "../models/chatroom-model.js";
import User from "../models/user-model.js";
import UserInChatroom from "../models/user-in-chatroom-model.js";

export const approveUserInChatroom = async (req, res, next) => {
    try {
        const { chatroomId, userId, adminId } = req.body;
        const adminDetails = await User.findOne({_id: adminId});

        const chatroomDetails = await Chatroom.findOne({_id: chatroomId});
        if (!adminDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to Approve Users in Chatroom"});
        }
        const membership = await UserInChatroom.findOne({ chatroomId, adminId, userId, status: "requested" });
        
        if (!membership) {
            return res.status(404).json({ message: "No join request found for this user in chatroom" });
        }

        if (membership.status === "approved") {
            return res.status(400).json({ message: "User already approved in this chatroom" });
        }

        membership.status = "approved";
        membership.joinedAt = new Date();

        await membership.save();

        return res.status(200).json({ message: "User approved in chatroom", data: membership });
    } catch (err) {
        next({
            message: "Error in Approving User for Chatroom",
            status: 500,
            extraDetails: err.message
        });
    }
};

export const removeUserFromChatroom = async (req, res, next) => {
    try {
        const { chatroomId, userId, adminId } = req.body;
        const userDetails = await User.findOne({_id: userId});
        const adminDetails = await User.findOne({_id: adminId});
        const chatroomDetails = await Chatroom.findOne({_id: chatroomId});
        if (!adminDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to Remove Users from Chatroom"});
        }
        const deleted = await UserInChatroom.updateOne({ chatroomId, userId }, {isRemoved: true});

        if (!deleted) {
            return res.status(404).json({ message: "User not found in chatroom" });
        }

        return res.status(200).json({ message: "User removed from chatroom" });
    } catch (err) {
        next({
            message: "Error in Removing User from Chatroom",
            status: 500,
            extraDetails: err.message
        });
    }
};

export const requestForChatroom = async (req, res, next) => {
    try {
        const { chatroomId, userId } = req.body;

        const existing = await UserInChatroom.findOne({ chatroomId, userId });
        if (existing) {
            return res.status(400).json({ message: "User already requested to join chatroom" });
        }
        const chatroomDetails = await Chatroom.findOne({_id: chatroomId});
        const adminId = chatroomDetails.userId;

        const newRequest = new UserInChatroom({
            chatroomId,
            userId,
            adminId,
            status: "requested"
        });

        await newRequest.save();

        return res.status(201).json({ message: "Join request submitted", data: newRequest });
    } catch (err) {
        next({
            message: "Error in Requesting to Join Chatroom",
            status: 500,
            extraDetails: err.message
        });
    }
};

// export const FetchApprovalRequests = async (req, res, next) => {
//     try {
//         const { chatroomId, userId} = req.body;
//         const userDetails = await User.findOne({_id: userId});
//         const chatroomDetails = await Chatroom.findOne({_id: chatroomId});

//         if (!userDetails._id.equals(chatroomDetails.userId)) {
//             return res.status(400).send({message: "User Does not have permission to Approve Users in Chatroom"});
//         }
        
//         const results = await UserInChatroom.find({chatroomId: chatroomId, adminId: userId, status: "requested"});
//         return res.status(200).json({ message: "Fetched Approval Requests from chatroom", requests: results});
//     } catch (err) {
//         next({
//             message: "Error in Fetching Approval Requests in Chatroom",
//             status: 500,
//             extraDetails: err.message
//         });
//     }
// };
export const FetchApprovalRequests = async (req, res, next) => {
    try {
        const { chatroomId, userId } = req.body;
        const userDetails = await User.findOne({ _id: userId });
        const chatroomDetails = await Chatroom.findOne({ _id: chatroomId });

        if (!userDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({ message: "User does not have permission to Approve Users in Chatroom" });
        }

        // Step 1: Fetch requests
        const requests = await UserInChatroom.find({
            chatroomId: chatroomId,
            adminId: userId,
            status: "requested"
        });

        // Step 2: Extract all userIds
        const userIds = requests.map(req => req.userId);

        // Step 3: Fetch usernames for those IDs in one query
        const users = await User.find({ _id: { $in: userIds } }, { username: 1 });

        // Step 4: Create a map for quick lookup
        const userMap = {};
        users.forEach(u => {
            userMap[u._id.toString()] = u.username;
        });

        // Step 5: Attach usernames to each request
        const enrichedRequests = requests.map(r => ({
            ...r.toObject(),
            username: userMap[r.userId.toString()] || null
        }));

        return res.status(200).json({
            message: "Fetched Approval Requests from chatroom",
            requests: enrichedRequests
        });

    } catch (err) {
        next({
            message: "Error in Fetching Approval Requests in Chatroom",
            status: 500,
            extraDetails: err.message
        });
    }
};


export const rejectUserInChatroom = async (req, res, next) => {
    try {
        const { chatroomId, userId, adminId } = req.body;
        const adminDetails = await User.findOne({_id: adminId});

        const chatroomDetails = await Chatroom.findOne({_id: chatroomId});
        if (!adminDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to Reject Users in Chatroom"});
        }
        const membership = await UserInChatroom.findOne({ chatroomId, adminId, userId, status: "requested" });
        
        if (!membership) {
            return res.status(404).json({ message: "No join request found for this user in chatroom" });
        }

        await UserInChatroom.deleteOne({chatroomId, adminId, userId, status: "requested"})

        return res.status(200).json({ message: "User approved in chatroom", data: membership });
    } catch (err) {
        next({
            message: "Error in Approving User for Chatroom",
            status: 500,
            extraDetails: err.message
        });
    }
};

export const leaveChatroom = async (req, res, next) => {
    try {
        const { chatroomId, userId} = req.body;
        await UserInChatroom.deleteOne({chatroomId, userId});
        return res.status(200).json({ message: "User Left Chatroom", data: membership });
    } catch (err) {
        next({
            message: "Error in Leaving Chatroom",
            status: 500,
            extraDetails: err.message
        });
    }
};

