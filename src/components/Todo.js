import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from "../services/auth.service";
import { useParams, useNavigate } from 'react-router-dom';

const TodoForm = () => {
  const currentUser = AuthService.getCurrentUser();
  const token = currentUser.accessToken;
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState({ name: '', description: '', completed: 'Yes' });
  const [error, setError] = useState(null);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/todos/${id}`, config);
      setTodo({
        ...response.data,
        completed: response.data.completed ? 'Yes' : 'No' 
      });
    } catch (err) {
      setError('Error fetching todo item');
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/todos/${id}`, todo, config); 
      } else {
        await axios.post('/api/todos', todo, config); 
      }
      navigate('/todolist');
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>{id ? 'Edit To-Do Item' : 'Add New To-Do Item'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
      <label>
      Name:
        <input
          type="text"
          name="name"
          value={todo.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        </label>
        <label>
        Description:
        <textarea
          name="description"
          value={todo.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        </label>
        <label>
          Completed:
          <select
            name="completed"
            value={todo.completed}
            onChange={handleInputChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>
        
        <button type="submit">{id ? 'Update Todo' : 'Add Todo'}</button>
        <button type="button" onClick={() => navigate('/todolist')}>Cancel</button>
      </form>
    </div>
  );
};

export default TodoForm;
