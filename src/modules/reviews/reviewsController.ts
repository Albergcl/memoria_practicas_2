import { Request, Response } from 'express';
import { getDB } from '../../database/mongo';
import { createReview, deleteReview, getAverageRatingByMovie, getReviewsByMovie, getUserReviewForMovie, movieExists, updateReview } from './reviewsService';

export const addReview = async (req: Request, res: Response) => {
    try {
        const { movieId, rating, comment } = req.body;
        const userId = (req as any).user.id;

        if (!movieId || !rating || !comment) {
            return res.status(400).json({ message: "Missing required review fields." });
        }

        const movie = await movieExists(getDB(), movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found." });
        }

        if (rating && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
        }

        const newReview = await createReview(getDB(), {
            userId,
            movieId,
            rating,
            comment
        });

        return res.status(201).json({ message: "Review created successfully.", review: newReview });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const editReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId as string;
        const { rating, comment } = req.body;
        const userId = (req as any).user.id;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Missing required review fields to update." });
        }

        if (rating && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating must be an integerbetween 1 and 5." });
        }

        const updatedReview = await updateReview(getDB(), reviewId, userId, { rating, comment });

        return res.status(200).json({ message: "Review updated successfully.", review: updatedReview });
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
}

export const removeReview = async (req: Request, res: Response) => {
    try {
        const reviewId = req.params.reviewId as string;
        const userId = (req as any).user.id;

        const result = await deleteReview(getDB(), reviewId, userId);

        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const listReviewsByMovie = async (req: Request, res: Response) => {
    try {
        const movieId = req.params.movieId as string;

        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required." });
        }

        const reviews = await getReviewsByMovie(getDB(), movieId);
        return res.status(200).json(reviews);
    } catch (error: any) {
        return res.status(500).json({ message: "Error fetching reviews." });
    }
};

export const getAverageRating = async (req: Request, res: Response) => {
    try {
        const movieId = req.params.movieId as string;

        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required." });
        }

        const result = await getAverageRatingByMovie(getDB(), movieId);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: "Error fetching average rating." });
    }
};

export const getMyReviewForMovie = async (req: Request, res: Response) => {
    try {
        const movieId = req.params.movieId as string;
        const userId = (req as any).user.id;

        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required." });
        }

        const review = await getUserReviewForMovie(getDB(), userId, movieId);
        return res.status(200).json(review);
    } catch (error: any) {
        return res.status(500).json({ message: "Error fetching user review." });
    }
};