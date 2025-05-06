import { useState } from 'react';
import API from '../utils/api.js';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await API.post('/users/register', form);
            localStorage.setItem('token', res.data.token);
            navigate('/posts');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-dark">
            <div className="w-full max-w-md px-4">
                <div className="bg-secondary rounded-2xl shadow-custom p-8 hover-scale">
                    <h1 className="text-3xl font-bold text-light text-center mb-2">Créer un compte</h1>
                    <p className="text-gray text-center mb-8">Rejoignez notre communauté</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-light block">
                                Nom
                            </label>
                            <input
                                id="name"
                                name="name"
                                onChange={handleChange}
                                required
                                className="w-full p-3 bg-dark border-none rounded-xl text-light focus:outline-none focus:ring-2 focus:ring-primary transition"
                                placeholder="Votre nom"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-light block">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                required
                                className="w-full p-3 bg-dark border-none rounded-xl text-light focus:outline-none focus:ring-2 focus:ring-primary transition"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-light block">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                required
                                className="w-full p-3 bg-dark border-none rounded-xl text-light focus:outline-none focus:ring-2 focus:ring-primary transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-primary text-light font-medium rounded-xl hover:bg-opacity-90 transition shadow-sm flex justify-center items-center cursor-pointer"
                        >
                            {isLoading ? 'Inscription...' : 'S\'inscrire'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-light">
                            Déjà inscrit ? {' '}
                            <Link to="/login" className="text-primary font-medium hover:underline cursor-pointer">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}