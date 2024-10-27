import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import AuthService from "../services/auth.service";
import { Link, useNavigate } from 'react-router-dom'; 

const TodoList = () => { 
    const currentUser = AuthService.getCurrentUser();
    const token = currentUser.accessToken;
    const [todos, setTodos] = useState([]); 
    const [error, setError] = useState(null); 
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null }); 
    const navigate = useNavigate(); 
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const fetchTodos = async () => { 
        try { 
            const response = await axios.get('http://localhost:8080/api/todos', config); 
            setTodos(response.data); 
        } catch (err) { 
            setError('Error fetching to-do items'); 
            console.error(err); 
        } 
    }; 

    const deleteTodo = async (id) => { 
        try { 
            await axios.delete(`/api/todos/${id}`, config); 
            setTodos(todos.filter(todo => todo._id !== id)); 
            setConfirmDelete({ open: false, id: null }); 
        } catch (err) { 
            console.error('Error deleting todo:', err); 
        } 
    }; 

    useEffect(() => { 
        fetchTodos(); 
    }, []); 

    return ( 
        <div> 
            <h2>To-Do List</h2> 
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            <button onClick={() => navigate('/addtodo')}>Add New Todo</button> 
            {todos.length > 0 ? ( 
                <table style={{ width: '100%', borderCollapse: 'collapse' }}> 
                    <thead> 
                        <tr> 
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th> 
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th> 
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th> 
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th> 
                        </tr> 
                    </thead> 
                    <tbody> 
                        {todos.map((todo) => ( 
                            <tr key={todo._id}> 
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{todo.name}</td> 
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{todo.description}</td> 
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{todo.completed ? 'Completed' : 'Pending'}</td> 
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}> 
                                    <Link to={`/edittodo/${todo._id}`}>Edit</Link> 
                                    <button onClick={() => setConfirmDelete({ open: true, id: todo._id })}>Delete</button> 
                                </td> 
                            </tr> 
                        ))} 
                    </tbody> 
                </table> 
            ) : ( 
                <p>No to-do items available.</p> 
            )} 
            {confirmDelete.open && ( 
                <div className="overlay">
                <div className="confirm-delete" style={{ border: '1px solid #ddd', padding: '10px', marginTop: '20px', backgroundColor: '#f8f8f8' }}> 
                    <p>Are you sure you want to delete this item?</p> 
                    <button onClick={() => deleteTodo(confirmDelete.id)}>Yes</button> 
                    <button onClick={() => setConfirmDelete({ open: false, id: null })}>No</button> 
                </div> 
                </div>
            )} 
        </div> 
    ); 
}; 

export default TodoList; 
