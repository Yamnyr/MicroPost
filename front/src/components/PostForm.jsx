import { useState } from 'react';
import API from '../utils/api.js';
import { jwtDecode } from 'jwt-decode';

export default function PostForm({ onSuccess }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const MAX_CHARS = 280;

    const handleChange = (e) => {
        const text = e.target.value;
        if (text.length <= MAX_CHARS) {
            setContent(text);
            setCharCount(text.length);
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const { userId } = jwtDecode(token);
            await API.post('/posts', { content, userId });
            setContent('');
            setCharCount(0);
            onSuccess();
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-secondary rounded-xl shadow-custom mb-8 hover-scale">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-xl font-bold text-light mb-4">Partagez votre pensée</h2>

                <div className="relative">
                    <textarea
                        name="content"
                        placeholder="Qu'avez-vous en tête ?"
                        value={content}
                        onChange={handleChange}
                        className="w-full p-4 bg-dark border-none rounded-xl text-light focus:outline-none focus:ring-2 focus:ring-primary transition resize-none h-32 scrollbar-custom"
                    />

                    <div className="flex justify-between items-center mt-3">
                        <div className={`text-sm ${charCount > MAX_CHARS * 0.8 ? 'text-primary' : 'text-gray'}`}>
                            {charCount}/{MAX_CHARS}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className={`px-6 py-2 rounded-xl text-light font-medium transition cursor-pointer ${
                                content.trim()
                                    ? 'bg-primary hover:bg-opacity-90'
                                    : 'bg-gray opacity-50'
                            }`}
                        >
                            {isSubmitting ? 'Publication...' : 'Publier'}
                        </button>

                    </div>
                </div>
            </form>
        </div>
    );
}