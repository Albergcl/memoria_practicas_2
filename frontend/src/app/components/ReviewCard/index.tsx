"use client";
import "./styles.css";
import { useState } from "react";
import { Review } from "@/app/types";
import StarRating from "../StarRating";
import api from "@/api/api";

type Props = {
    review: Review;
    isOwner: boolean;
    username?: string;
    onUpdated: () => void;
    onDeleted: () => void;
};

const ReviewCard = ({ review, isOwner, username, onUpdated, onDeleted }: Props) => {
    const [editing, setEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment);
    const [loading, setLoading] = useState(false);

    const date = new Date(review.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleSave = async () => {
        try {
            setLoading(true);
            await api.put(`/reviews/${review._id}`, {
                rating: editRating,
                comment: editComment,
            });
            setEditing(false);
            onUpdated();
        } catch (e) {
            alert("Error al actualizar la reseña: " + String(e));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Eliminar esta reseña?")) return;
        try {
            setLoading(true);
            await api.delete(`/reviews/${review._id}`);
            onDeleted();
        } catch (e) {
            alert("Error al eliminar la reseña: " + String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reviewCard">
            <div className="reviewHeader">
                <div className="reviewMeta">
                    {username && <span className="reviewUsername">{username}</span>}
                    <StarRating value={review.rating} readonly />
                    <span className="reviewDate">{date}</span>
                </div>
                {isOwner && !editing && (
                    <div className="reviewActions">
                        <button className="btnEdit" onClick={() => setEditing(true)}>Editar</button>
                        <button className="btnDelete" onClick={handleDelete} disabled={loading}>Eliminar</button>
                    </div>
                )}
            </div>

            {editing ? (
                <div className="editForm">
                    <StarRating value={editRating} onChange={setEditRating} />
                    <textarea
                        className="editTextarea"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                    />
                    <div className="editButtons">
                        <button className="btnSave" onClick={handleSave} disabled={loading}>
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                        <button className="btnCancel" onClick={() => setEditing(false)}>Cancelar</button>
                    </div>
                </div>
            ) : (
                <p className="reviewComment">{review.comment}</p>
            )}
        </div>
    );
};

export default ReviewCard;
