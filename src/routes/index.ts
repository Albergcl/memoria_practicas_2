import { Router } from "express";
import authRoutes from "../modules/auth/authRoutes";
import moviesRoutes from "../modules/movies/moviesRoutes";
import reviewsRoutes from "../modules/reviews/reviewsRoutes";
import forumsRoutes from "../modules/forums/forumsRoutes";
import usersRoutes from "../modules/users/usersRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/movies", moviesRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/forums", forumsRoutes);
router.use("/users", usersRoutes);

export default router;