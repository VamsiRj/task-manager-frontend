import React, { useState } from 'react';
import { useUserDetails } from '../../context';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
 
const CreateTask = () => {
  const navigate = useNavigate();
  const { userId: adminId } = useUserDetails();
  const [task, setTask] = useState({
    name: '',
    description: '',
    targetDate: '',
    status: '',
    priority: '',
    tags: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };
 
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd
    setTask((prev) => ({
      ...prev,
      targetDate: formattedDate,
    }));
  };
 
  const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time
    return today;
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5185/api/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
          adminId: adminId,
        },
      });
 
      if (response.status === 200) {
        setMsg('Task created successfully!');
        setTask({
          name: '',
          description: '',
          targetDate: '',
          status: '',
          priority: '',
          tags: '',
        });
        setSelectedDate(null);
      } else {
        setMsg('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMsg('An error occurred while creating the task.');
    } finally {
      setLoading(false);
    }
  };
 
  if (msg) {
    setTimeout(() => setMsg(''), 2000);
  }
 
  return (
    <div className='create-task-container'>
      <div className='task-container'>
        <h2>Create Task</h2>
        <form className='task-form' onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder='Task Name'
            value={task.name}
            onChange={handleChange}
            required
          />
 
          <textarea
            name='description'
            placeholder='Description'
            value={task.description}
            onChange={handleChange}
            required
          />
 
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={getMinDate()}
            dateFormat='yyyy-MM-dd'
            placeholderText='Select Target Date'
            className='date-picker'
            required
            onCalendarClose={() => console.log('Calendar closed')}
          />
 
          <select
            name='status'
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value='' disabled>Select Status</option>
            <option value='completed'>Completed</option>
            <option value='in progress'>In Progress</option>
            <option value='pending'>Pending</option>
            <option value='not started'>Not Started</option>
          </select>
 
          <select
            name='priority'
            value={task.priority}
            onChange={handleChange}
            required
          >
            <option value='' disabled>Select Priority</option>
            <option value='high'>High</option>
            <option value='medium'>Medium</option>
            <option value='low'>Low</option>
          </select>
 
          <input
            type='text'
            name='tags'
            placeholder='Tags (comma-separated)'
            value={task.tags}
            onChange={handleChange}
            required
          />
 
          <button type='button' className='go-back-btn' onClick={() => navigate(-1)}>
            Go Back
          </button>
 
          {!isLoading && <button type='submit'>Create Task</button>}
          {isLoading && <TailSpin width='50px' color='green' />}
          <p>{msg}</p>
        </form>
      </div>
    </div>
  );
};
 
export default CreateTask;
 
 