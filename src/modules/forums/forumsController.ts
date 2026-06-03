import { Request, Response } from 'express';
import { getDB } from '../../database/mongo';
import { getOrCreateForum, addMessageToForum, getForumByMovie } from './forumsService';

export const getForum = async (req: Request, res: Response) => {
    try {
        const movieId = req.params .movieId as string;

        const forum = await getOrCreateForum(getDB(), movieId);

        res.status(200).json(forum);
    } catch (error) {
        res.status(500).json({ message: "Error fetching forum" });
    }
};

export const postMessage = async (req: Request, res: Response) => {
    try {
        const movieId = req.params.movieId as string;
        const { userId, username, text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: "Message text is required" });
        }

        if (text.length > 500) {
            return res.status(400).json({ message: "Message text exceeds maximum length of 500 characters" });
        }

        // Comprobar que el foro existe
        const forum = await getOrCreateForum(getDB(), movieId);
        if (!forum) {
            return res.status(404).json({ message: "Forum not found" });
        }

        const message = await addMessageToForum(getDB(), movieId, userId, username, text);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Error posting message" });
    }
};