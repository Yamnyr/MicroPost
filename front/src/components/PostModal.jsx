import { useEffect, useState } from 'react';
import API from '../utils/api.js';

export default function PostModal({ isOpen, onClose, postId, onSuccess }) {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Animation d'entrée
            setTimeout(() => setIsVisible(true), 10);
            if (postId) {
                fetchPostDetails();
            }
        } else {
            setIsVisible(false);
        }
    }, [isOpen, postId]);

    const fetchPostDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.get(`/posts/${postId}`);
            setPost(res.data);
            setEditContent(res.data.content);
        } catch (error) {
            console.error('Failed to fetch post details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseWithAnimation = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Attend que l'animation de sortie se termine
    };

    const handleEdit = async () => {
        if (!editContent.trim()) return;

        setIsSubmitting(true);
        try {
            await API.put(`/posts/${postId}`, { content: editContent });
            setIsEditing(false);
            if (onSuccess) onSuccess();
            handleCloseWithAnimation();
        } catch (error) {
            console.error('Failed to update post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await API.delete(`/posts/${postId}`);
            if (onSuccess) onSuccess();
            handleCloseWithAnimation();
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 bg-[rgba(0,0,0,0.8)] z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-secondary rounded-xl shadow-custom w-full max-w-lg transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-light">
                                    {isEditing ? 'Modifier le post' :
                                        isDeleting ? 'Supprimer le post' : 'Détails du post'}
                                </h2>
                                <button
                                    onClick={handleCloseWithAnimation}
                                    className="p-1 hover:text-primary transition cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            {isEditing ? (
                                <div className="mb-4">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full p-4 bg-dark border-none rounded-xl text-light focus:outline-none focus:ring-2 focus:ring-primary transition resize-none h-32 scrollbar-custom"
                                    />
                                </div>
                            ) : isDeleting ? (
                                <div className="mb-4">
                                    <p className="text-light mb-4">Êtes-vous sûr de vouloir supprimer ce post ? Cette
                                        action est irréversible.</p>
                                    <div className="bg-dark p-4 rounded-xl mb-4">
                                        <p className="text-light italic">{post?.content}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="bg-dark p-4 rounded-xl mb-4">
                                        <p className="text-light break-words">{post?.content}</p>
                                    </div>
                                    <div className="text-sm text-gray flex justify-between">
                                        <p>Par: {post?.user.name || post?.userId}</p>
                                        <time>{formatDate(post?.createdAt)}</time>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className=" border-dark border-opacity-20 p-4 flex justify-end gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-light rounded-xl hover:bg-dark transition cursor-pointer"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-primary text-light rounded-xl hover:bg-opacity-90 transition cursor-pointer"
                                    >
                                        {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                                    </button>
                                </>
                            ) : isDeleting ? (
                                <>
                                    <button
                                        onClick={() => setIsDeleting(false)}
                                        className="px-4 py-2 text-light rounded-xl hover:bg-dark transition cursor-pointer"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-primary text-light rounded-xl hover:bg-opacity-90 transition cursor-pointer"
                                    >
                                        {isSubmitting ? 'Suppression...' : 'Confirmer la suppression'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-secondary border border-primary text-light rounded-xl hover:bg-dark transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => setIsDeleting(true)}
                                        className="px-4 py-2 bg-primary text-light rounded-xl hover:bg-opacity-90 transition flex items-center gap-1 cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                        </svg>
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}