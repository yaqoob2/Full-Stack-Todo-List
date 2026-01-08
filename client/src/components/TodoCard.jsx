import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { FaTrash, FaEdit, FaPlay, FaPause, FaSave, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const TodoCard = ({ todo, refreshTodos }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTodo, setEditedTodo] = useState({ ...todo });
    const [timerActive, setTimerActive] = useState(false);
    const [seconds, setSeconds] = useState(todo.timer_seconds || 0);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    useEffect(() => {
        if (timerActive) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            // Save timer on pause
            if (seconds !== todo.timer_seconds) {
                saveTimer();
            }
        }
    }, [timerActive]);

    const saveTimer = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, { timer_seconds: seconds });
        } catch (err) {
            console.error("Failed to save timer", err);
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure?')) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`);
            refreshTodos();
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, editedTodo);
            setIsEditing(false);
            refreshTodos();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComplete = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, { is_completed: !todo.is_completed });
            refreshTodos();
        } catch (err) {
            console.error(err);
        }
    };

    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isEditing) {
        return (
            <div className="glass-panel animate-fade-in" style={{ padding: '20px' }}>
                <input
                    value={editedTodo.title}
                    onChange={e => setEditedTodo({ ...editedTodo, title: e.target.value })}
                    placeholder="Title"
                />
                <textarea
                    value={editedTodo.description}
                    onChange={e => setEditedTodo({ ...editedTodo, description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due Date</label>
                        <input
                            type="datetime-local"
                            value={editedTodo.due_date ? new Date(editedTodo.due_date).toISOString().slice(0, 16) : ''}
                            onChange={e => setEditedTodo({ ...editedTodo, due_date: e.target.value })}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reminder</label>
                        <input
                            type="datetime-local"
                            value={editedTodo.reminder_at ? new Date(editedTodo.reminder_at).toISOString().slice(0, 16) : ''}
                            onChange={e => setEditedTodo({ ...editedTodo, reminder_at: e.target.value })}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleUpdate}><FaSave /> Save</button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '20px', position: 'relative', borderLeft: todo.is_completed ? '4px solid #10b981' : '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ textDecoration: todo.is_completed ? 'line-through' : 'none', color: todo.is_completed ? 'var(--text-muted)' : 'white' }}>{todo.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '5px 0' }}>{todo.description}</p>

                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap', marginTop: '10px' }}>
                        {todo.due_date && (
                            <span className="badge">📅 Due: {format(new Date(todo.due_date), 'MMM d, h:mm a')}</span>
                        )}
                        {todo.reminder_at && (
                            <span className="badge">🔔 Remind: {format(new Date(todo.reminder_at), 'MMM d, h:mm a')}</span>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-icon" onClick={toggleComplete} style={{ background: todo.is_completed ? '#10b981' : 'rgba(255,255,255,0.1)' }}>
                        <FaCheck color={todo.is_completed ? 'white' : 'var(--text-muted)'} />
                    </button>
                    <button className="btn-icon" onClick={() => setIsEditing(true)} style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                        <FaEdit color="#60a5fa" />
                    </button>
                    <button className="btn-icon" onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                        <FaTrash color="#fca5a5" />
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
                    {formatTime(seconds)}
                </div>
                <button
                    className="btn-icon"
                    onClick={() => setTimerActive(!timerActive)}
                    style={{ background: timerActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', width: '40px', height: '40px', borderRadius: '50%' }}
                >
                    {timerActive ? <FaPause color="#fca5a5" /> : <FaPlay color="#34d399" />}
                </button>
            </div>
        </div>
    );
};

export default TodoCard;
