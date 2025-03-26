import React, { useState, useEffect } from 'react';
import Home from '../Home';
import { TailSpin } from 'react-loader-spinner';
import { useUserDetails } from '../../context';
import Task from '../Task';
import './index.css'; // Import updated CSS file

const TaskDashboard = () => {
  console.log('Admin Dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const { role } = useUserDetails();

  // Fetch tasks data from API
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5185/api/tasks');
      const response2 = await fetch(
        'http://localhost:5185/api/task-assignments/all'
      );
      if (!response.ok || !response2.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      const data2 = await response2.json();
      console.log(typeof data2, data2);

      const data3 = data.map((ele) => {
        const a = data2.find((item) => ele.taskId === item.taskId);
        return { ...ele, memberId: a?.userId };
      });
      console.log('data 3:', data3);
      setTasks(data3);
    } catch (err) {
      console.log('error triggered');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  if (role !== 'Admin') {
    return <Home />;
  }

  if (loading) {
    return (
      <div className='admin-dashboard-loader-container'>
        <TailSpin color='#4CAF50' height={80} width={80} />
      </div>
    );
  }
  const filteredTasks = tasks.filter(
    (ele) =>
      ele.name.toLowerCase().includes(search.toLowerCase()) ||
      ele.priority.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className='admin-dashboard-container'>
      <header className='admin-dashboard-header'>
        <h1>Task Dashboard</h1>
      </header>
      <div className='search-container'>
        <input
          placeholder='search by task name or priority'
          type='search'
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </div>
      {error && <p className='admin-dashboard-error-message'>{error}</p>}
      <div className='admin-dashboard-task-list'>
        {filteredTasks.map((task) => (
          <Task key={task.taskId} task={task} renderTasks={fetchTasks} />
        ))}
      </div>
    </div>
  );
};

export default TaskDashboard;
