import express from "express";
import User from "../models/user-model.js";

const home = async (req, res)=> {
    try{
        res.status(200).send({message: "Hi, This is Khalid from API"});
    }
    catch (err) {
        const status = 404;
        const message = "Error in home page";
        const extraDetails = err.errors[0].message;
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
};

const login = async (req, res)=> {
    try{
        const {email, password } = req.body;
        const userExists = await User.findOne({email: email});
        if (!userExists) {
            return res.status(400).json({message: "Error: Invalid Credentials", extraDetails: "Error: Invalid Credentials"});
        }
        const correctPass = await userExists.checkPassword(password);
        if (correctPass) {
            return res.status(200).json({message: "Login Successful", token: await userExists.generateToken(), userId: userExists._id.toString()});
        }
        else {
            return res.status(400).json({message: "Error: Invalid Credentials", extraDetails: "Error: Invalid Credentials"});
        }
    }
    catch (err) {
        const status = 404;
        const message = "Error in Login";
        const extraDetails = err.errors[0].message;
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
};

const register = async (req, res)=> {
    try{
        const {username, email, password} = req.body;
        const userExists = await User.findOne({username: username});
        if (userExists) {
            return res.status(400).json({message: "User Already Exists"});
        }
        const newUser = await User.create({username, email, password});
        res.status(200).json({message: "Registration Successful", token: await newUser.generateToken(), userId: newUser._id.toString()});
    }
    catch (err) {
        const status = 404;
        const message = "User Already Exists";
        const extraDetails = err.errors[0].message.toString();
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
};

const user = async (req, res) => {
    try {
        const userData = req.user;
        return res.status(200).json({message: userData});
    }
    catch (err) {
        const status = 401;
        const message = "User Token Does Not Exist";
        const extraDetails = err.errors[0].message.toString();
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export {login, register, home, user};