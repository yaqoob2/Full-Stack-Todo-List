import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TodoCard from '../components/TodoCard';
import { FaPlus, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [todos, setTodos] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newTodo, setNewTodo] = useState({ title: '', description: '', due_date: '', reminder_at: '' });

    const fetchTodos = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/todos`);
            setTodos(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/todos`, newTodo);
            setNewTodo({ title: '', description: '', due_date: '', reminder_at: '' });
            setShowAdd(false);
            fetchTodos();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px 0' }}>
                <div>
                    <h1 style={{ fontWeight: 700, background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem' }}>
                        ManageToDos
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.username}</p>
                </div>
                <button className="btn" onClick={logout} style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <FaSignOutAlt /> Logout
                </button>
            </header>

            <div style={{ marginBottom: '30px' }}>
                {!showAdd ? (
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)} style={{ width: '100%', padding: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaPlus /> Add New Task
                    </button>
                ) : (
                    <div className="glass-panel animate-fade-in" style={{ padding: '30px' }}>
                        <h2 style={{ marginBottom: '20px' }}>New Task</h2>
                        <form onSubmit={handleAdd}>
                            <input
                                placeholder="Task Title"
                                value={newTodo.title}
                                onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newTodo.description}
                                onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
                                rows={3}
                            />
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Due Date</label>
                                    <input
                                        type="datetime-local"
                                        value={newTodo.due_date}
                                        onChange={e => setNewTodo({ ...newTodo, due_date: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-muted)' }}>Reminder</label>
                                    <input
                                        type="datetime-local"
                                        value={newTodo.reminder_at}
                                        onChange={e => setNewTodo({ ...newTodo, reminder_at: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Task</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="todo-grid">
                {todos.map(todo => (
                    <TodoCard key={todo.id} todo={todo} refreshTodos={fetchTodos} />
                ))}
            </div>

            {todos.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                    <p>No tasks yet. Create one to get started!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
