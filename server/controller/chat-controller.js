import express from "express";
import Chatroom from "../models/chatroom-model.js";
import User from "../models/user-model.js";
import UserInChatroom from "../models/user-in-chatroom-model.js";
import Chat from "../models/chat-model.js";

export const addChat = async (req, res, next) => {
    try{
        const {chatroomId, userId, username, message} = req.body; 
        const newChat = await Chat.create({chatroomId, userId, username, message});
        const userInChatroomDetails = await UserInChatroom.findOne({chatroomId: chatroomId, userId: userId, status: "approved"});
        if (!userInChatroomDetails) {
            return res.status(400).send({message: "User is not approved in this chatroom"});
        }
        res.status(200).json({message: `Creation of Message Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Creating Chat";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const deleteChat = async (req, res, next) => {
    try{
        const {chatId, userId} = req.body;
        const updatingOne = await Chat.updateOne({_id: chatId, userId:userId}, {isDeleted:true});
        res.status(200).json({message: `Removal of Chat Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Removing Chat";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const deleteChatsOfChatroom = async (req, res, next) => {
    try{
        const {userId, chatroomId} = req.body;
        const userDetails = await User.findOne({_id: userId});
        const chatroomDetails = await Chatroom.findOne({_id: chatroomId});
        if (!userDetails.isAdmin && !userDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to Delete Chats of Chatroom"});
        }
        const updatingMany = await Chat.updateMany({chatroomId: chatroomId}, {isDeleted:true});
        res.status(200).json({message: `Removal of Chats from Chatroom Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Removing Chats from Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const deleteAllChats = async (req, res, next) => {
    try{
        const {userId, password} = req.body;
        if (password != process.env.DELETE_PASSWORD) throw err;
        const userDetails = await User.findOne({_id: userId});
        if (!userDetails.isAdmin && !userDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to delete all chats"});
        }
        const updatingMany = await Chat.updateMany({isDeleted:true});
        res.status(200).json({message: `Removal of Chats from Chatroom Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Removing Chats from Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const hardDeleteChats = async (req, res, next) => {
    try{
        const {userId, password} = req.body;
        if (password != process.env.DELETE_PASSWORD) throw err;
        const userDetails = await User.findOne({_id: userId});
        if (!userDetails.isAdmin && !userDetails._id.equals(chatroomDetails.userId)) {
            return res.status(400).send({message: "User Does not have permission to Hard Delete Chats"});
        }
        const deletion = await Chat.deleteMany({isDeleted:true});
        res.status(200).json({message: `Recycling of Chats Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Recycling Chats";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const fetchChat = async (req, res, next) => {
    try{
        const {chatroomId} = req.body;
        const chatrooms = await Chat.find({chatroomId:chatroomId, isDeleted: false});
        res.status(200).json({message: `Fetching Chatroom Chats was Successful`, chatrooms:chatrooms});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatroom Chats";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const updateChat = async (req, res, next) => {
    try{
        const {chatId, userId, newMessage} = req.body;
        console.log("Reached here", chatId, userId, newMessage);
        const updation = await Chat.updateOne({_id: chatId, userId: userId}, {isEdited:true, message: newMessage});
        console.log(updation);
        res.status(200).json({message: `Removal of Chat Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Updating Chat";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}