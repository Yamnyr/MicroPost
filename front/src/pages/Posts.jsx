import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api.js';
import PostForm from '../components/PostForm.jsx';
import PostCard from '../components/PostCard.jsx';
import PostModal from '../components/PostModal.jsx';
import { jwtDecode } from 'jwt-decode';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await API.get('/posts');
            setPosts(res.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                const userId = decoded.userId;

                const res = await API.get(`/users/${userId}`);
                setUserName(res.data.name || 'Utilisateur');
            }
        } catch (error) {
            console.error('Erreur récupération nom utilisateur:', error);
            setUserName('Utilisateur');
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleOpenModal = (postId) => {
        setSelectedPostId(postId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPostId(null);
    };

    useEffect(() => {
        getUserInfo();
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-dark">
            <header className="sticky top-0 bg-dark z-10 border-b border-secondary border-opacity-20 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-primary">Micro<span className="text-secondary">Post</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-light hidden md:block">Bonjour, {userName}</p>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-secondary text-light rounded-xl hover:bg-primary transition text-sm font-medium cursor-pointer"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <PostForm onSuccess={fetchPosts} />

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-light">Fil d'actualité</h2>

                    <button
                        onClick={fetchPosts}
                        className="px-4 py-2 text-sm text-secondary hover:text-primary transition flex items-center gap-1 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                            <path d="M8 16H3v5"></path>
                        </svg>
                        Actualiser
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onOpenModal={handleOpenModal}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray text-lg">Aucun post pour le moment. Soyez le premier à partager !</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <PostModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                postId={selectedPostId}
                onSuccess={fetchPosts}
            />
        </div>
    );
}