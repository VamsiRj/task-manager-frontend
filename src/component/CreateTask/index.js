import React, { useState } from 'react';
import { useUserDetails } from '../../context';
import { TailSpin } from 'react-loader-spinner';
import './index.css';

const CreateTask = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5185/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          adminId: adminId,
        },
        body: JSON.stringify(task),
      });
      setLoading(true);
      if (response.ok) {
        setMsg('Task created successfully!');
        setTask({
          name: '',
          description: '',
          targetDate: '',
          status: '',
          priority: '',
          tags: '',
        });
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
    setTimeout(() => {
      setMsg('');
    }, 2000);
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

          <input
            type='datetime-local'
            name='targetDate'
            value={task.targetDate}
            onChange={handleChange}
            required
          />

          {/* Status Dropdown */}
          <select
            name='status'
            value={task.status}
            onChange={handleChange}
            required
          >
            <option value='' disabled>
              Select Status
            </option>
            <option value='completed'>Completed</option>
            <option value='in progress'>In Progress</option>
            <option value='pending'>Pending</option>
            <option value='not started'>Not Started</option>
          </select>

          {/* Priority Dropdown */}
          <select
            name='priority'
            value={task.priority}
            onChange={handleChange}
            required
          >
            <option value='' disabled>
              Select Priority
            </option>
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

          {!isLoading && <button type='submit'>Create Task</button>}
          {isLoading && <TailSpin width='50px' color='green' />}
          <p>{msg}</p>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
