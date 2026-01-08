import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const url = isLogin ? `${import.meta.env.VITE_API_URL}/api/auth/login` : `${import.meta.env.VITE_API_URL}/api/auth/register`;

        try {
            if (isLogin) {
                const { data } = await axios.post(url, { email: formData.email, password: formData.password });
                login(data.user, data.token);
                navigate('/');
            } else {
                await axios.post(url, formData);
                setIsLogin(true); // Switch to login after register
                setError('Registration successful! Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && <div style={{ background: 'rgba(239,68,68,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    )}
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        style={{ color: 'var(--secondary)', cursor: 'pointer', fontWeight: 'bold' }}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
