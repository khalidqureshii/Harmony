import express from "express";
import Chatroom from "../models/chatroom-model.js";
import User from "../models/user-model.js";
import UserInChatroom from "../models/user-in-chatroom-model.js";
import Chat from "../models/chat-model.js";


export const addChatroom = async (req, res, next) => {
    try{
        const {chatroomName, userId} = req.body; 
        const chatroomExists = await Chatroom.findOne({chatroomName:chatroomName});
        if (chatroomExists) {
            return res.status(400).send({message: "Chatroom Already Exists"});
        }
        const newChatroom = await Chatroom.create({chatroomName, userId});
            await newChatroom.save();

        const userInChatroom = await UserInChatroom.create({chatroomId: newChatroom._id, userId: userId, status: "approved", joinedAt: new Date()});
            await userInChatroom.save();
        res.status(200).json({message: `Successfully Created Chatroom ${chatroomName}`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Creating Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const removeChatroom = async (req, res, next) => {
    try{
        const {chatroomId, userId} = req.body;
        const userDetails = await User.findOne({_id: userId});
        const chatroomDetails = await Chatroom.findOne({_id: chatroomId});
        if (!userDetails.isAdmin && !userDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to Remove Chatroom"});
        }
        const deletion = await Chatroom.updateOne({_id: chatroomId}, {isDeleted: true});
        res.status(200).json({message: `Successfully Removed Chatroom`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Removing Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const fetchChatrooms = async (req, res, next) => {
    try{
        const chatrooms = await Chatroom.find({isDeleted: false});
        res.status(200).json({message: `Successfully Fetched Chatrooms`, chatrooms:chatrooms});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatrooms";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const FetchChatroomsForUser = async (req, res, next) => {
    const {userId} = req.body;
    try{
        const chatrooms = await Chatroom.find({isDeleted: false});
        const joinedChatroomIds = await UserInChatroom.find({userId: userId}).distinct("chatroomId");
        const notJoinedChatrooms = chatrooms.filter(
            chatroom => !joinedChatroomIds.map(id => id.toString()).includes(chatroom._id.toString())
        );

        const joinedChatrooms = chatrooms.filter(
            chatroom => joinedChatroomIds.map(id => id.toString()).includes(chatroom._id.toString())
        );
        res.status(200).json({message: `Successfully Fetched Chatrooms For User`, joinedChatrooms: joinedChatrooms, notJoined: notJoinedChatrooms});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatrooms";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const getChatroom = async (req, res, next) => {
    try{
        const {chatroomId} = req.body
        const chatroomInfo = await Chatroom.find({_id: chatroomId});
        res.status(200).json({message: `Successfully Fetched Chatroom`, chatroomInfo:chatroomInfo});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const editChatroom = async (req, res, next) => {
    try{
        const {chatroomId, chatroomName} = req.body
        const chatroomInfo = await Chatroom.updateOne({_id: chatroomId}, {chatroomName: chatroomName});
        res.status(200).json({message: `Successfully Edited Chatroom`, chatroomInfo:chatroomInfo});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Editing Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
    next(errorDetails);
    }
}