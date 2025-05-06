import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function PostCard({ post, onOpenModal }) {
    const [isOwner, setIsOwner] = useState(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                return decoded.userId === post.userId;
            }
            return false;
        } catch (error) {
            return false;
        }
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Tronquer le contenu s'il est trop long
    const truncateContent = (content, maxLength = 150) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    return (
        <div className="bg-secondary rounded-xl shadow-custom hover-scale relative">
            {isOwner && (
                <button
                    onClick={() => onOpenModal(post._id)}
                    className="absolute top-2 right-2 p-2 text-light hover:text-primary transition"
                    title="Options"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            )}

            <div className="p-6">
                <p className="text-light mb-4 break-words">
                    {truncateContent(post.content)}
                    {post.content.length > 150 && (
                        <button
                            onClick={() => onOpenModal(post._id)}
                            className="text-primary hover:underline ml-1 text-sm cursor-pointer"
                        >
                            Voir plus
                        </button>
                    )}
                </p>

                <div className="flex justify-between items-center text-sm">
                    <p className="text-gray">Par: {post.user.name || post.userId}</p>
                    <time className="text-gray">{formatDate(post.createdAt)}</time>
                </div>
            </div>
        </div>
    );
}