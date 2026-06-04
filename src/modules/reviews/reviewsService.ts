import { Db, ObjectId } from "mongodb";

interface CreateReviewData {
    userId: string,
    movieId: string,
    rating: number,
    comment: string,
    username: string
}

interface UpdateReviewData {
    rating?: number,
    comment?: string
}

export const createReview = async (db: Db, reviewData: CreateReviewData) => {
    const reviewsCollection = db.collection("reviews");

    const exists = await reviewsCollection.findOne({
        userId: new ObjectId(reviewData.userId),
        movieId: new ObjectId(reviewData.movieId)
    });

    if (exists) {
        throw new Error("You already reviewed this movie.");
    }

    const newReview = {
        userId: new ObjectId(reviewData.userId),
        movieId: new ObjectId(reviewData.movieId),
        username: reviewData.username,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date()
    };

    const result = await reviewsCollection.insertOne(newReview);
    return {
        _id: result.insertedId,
        ...newReview
    };
}

export const getReviewsByMovie = async (db: Db, movieId: string) => {
    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection.find({ movieId: new ObjectId(movieId) }).toArray();
    return reviews;
}

export const updateReview = async (db: Db, reviewId: string, userId: string, updateData: UpdateReviewData) => {
    const reviewsCollection = db.collection("reviews");

    const review = await reviewsCollection.findOne({ 
        _id: new ObjectId(reviewId), 
        userId: new ObjectId(userId) 
    });

    if (!review) {
        throw new Error("Review not found or you do not have permission to update it.");
    }

    const updatedReview = await reviewsCollection.updateOne(
        { _id: new ObjectId(reviewId) },
        { $set: {
            rating: updateData.rating || review.rating,
            comment: updateData.comment || review.comment,
            updatedAt: new Date()
        }}
    );

    return {
        ...review,
        rating: updateData.rating || review.rating,
        comment: updateData.comment || review.comment,
        updatedAt: new Date()
    }
}

export const deleteReview = async (db: Db, reviewId: string, userId: string) => {
    const reviewsCollection = db.collection("reviews");

    const result = await reviewsCollection.deleteOne({ 
        _id: new ObjectId(reviewId), 
        userId: new ObjectId(userId) 
    });

    if (result.deletedCount === 0) {
        throw new Error("Review not found or you do not have permission to delete it.");
    }

    return { message: "Review deleted successfully." };
}

export const getAverageRatingByMovie = async (db: Db, movieId: string) => {
    const reviewsCollection = db.collection("reviews");

    const reviews = await reviewsCollection.find({ movieId: new ObjectId(movieId) }).toArray();

    if (reviews.length === 0) {
        return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return { averageRating, totalReviews: reviews.length };
}

export const getUserReviewForMovie = async (db: Db, userId: string, movieId: string) => {
    const reviewsCollection = db.collection("reviews");

    const review = await reviewsCollection.findOne({ 
        userId: new ObjectId(userId),
        movieId: new ObjectId(movieId)
    });

    return review;
}

export const movieExists = async (db: Db, movieId: string) => {
    const moviesCollection = db.collection("movies");

    const movie = await moviesCollection.findOne({ _id: new ObjectId(movieId) });
    return movie;
}