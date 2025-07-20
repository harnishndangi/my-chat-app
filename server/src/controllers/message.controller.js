import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select("-password");

        res.json(filteredUsers)
    } catch (error) {
        console.log("Error in getUserForSidebar", error.message);
        res.json({
            error: "Internal Server Error"
        })
    }
};

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                {
                    senderId: myId, receiverId: userToChatId
                },
                {
                    senderId: userToChatId, receiverId: myId
                },
            ],
        });
        res.json(message)
    } catch (error) {
        console.log("Error in getMessage controller:", error.message);
        res.json({ error: "Internal Server Error " });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        res.status(201).json(newMessage);

        //todo :during the implementation of the socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } 

    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.json({
            error: "Internal Server Error"
        })
    }
};
