import { ObjectId } from "mongodb"

export type User = {
    _id: ObjectId,
    username: string,
    email: string,
    password: string,
    role: "user" | "admin",
    createdAt: Date
}

export type Movie = {
    _id: ObjectId,
    tmdbId: number,
    title: string,
    overview: string,
    releaseDate: string,
    genres: string[],
    rating: number,
    posterPath: string,
    createdAt: Date
}

export type Review = {
    _id: ObjectId,
    userId: ObjectId,
    movieId: ObjectId,
    rating: number,
    comment: string,
    createdAt: Date,
    updatedAt?: Date
}

export type Forum = {
    _id: ObjectId,
  movieId: ObjectId,
  messages: [
    {
      _id: ObjectId,
      userId: ObjectId,
      username: string,
      text: string,
      createdAt: Date
    }
  ],
  createdAt: Date
}