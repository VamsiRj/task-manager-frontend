import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Home from '../Home';
import { TailSpin } from 'react-loader-spinner';
import { useUserDetails } from '../../context';
import Task from '../Task';
// import CreateTask from '../CreateTask';
import TeamMemberTask from '../TeamMemberTask';
import './index.css'; // Import updated CSS file

const TaskDashboard = () => {
  const navigate = useNavigate();
  console.log('Admin Dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const { role, userId: empId, setId, setRole } = useUserDetails();
  const logout = () => {
    setId(null);
    setRole('');
    console.log('logout button pressed');
  };

  // Fetch tasks data from API
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5185/api/tasks');
      const response2 = await fetch(
        'http://localhost:5185/api/task-assignments/all'
      );
      const response3 = await fetch('http://localhost:5185/api/users');
      if (!response.ok || !response2.ok || !response3.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      const data2 = await response2.json();
      const data4 = await response3.json();

      const data3 = data.map((ele) => {
        const a = data2.find((item) => ele.taskId === item.taskId);
        const b = data4.find((emp) => emp.userId === ele.ownerId);
        console.log('b', b, ele.ownerId);
        return {
          ...ele,
          memberId: a?.userId,
          ownerName: b?.username,
        };
      });
      console.log('data 3:', data4);
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
  let teamMemerTasks = [];
  if (role !== 'Admin') {
    teamMemerTasks = filteredTasks.filter((ele) => ele.memberId === empId);
  }
  return (
    <div className='admin-dashboard-container'>
      <header className='admin-dashboard-header'>
        <h1>Task Dashboard</h1>
        <button className='logout-btn' onClick={logout}>
          Logout
        </button>
      </header>
      <div className='search-container'>
        <input
          placeholder='search by task name or priority'
          type='search'
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
        {role === 'Admin' && (
          <button
            className='create-task-btn'
            onClick={() => navigate('/create-task')}
          >
            Create Task
          </button>
        )}
      </div>
      {error && <p className='admin-dashboard-error-message'>{error}</p>}
      <div className='admin-dashboard-task-list'>
        {role === 'Admin' &&
          filteredTasks.map((task) => (
            <Task key={task.taskId} task={task} renderTasks={fetchTasks} />
          ))}
        {role !== 'Admin' &&
          teamMemerTasks.map((task) => (
            <TeamMemberTask
              key={task.taskId}
              task={task}
              renderTasks={fetchTasks}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskDashboard;
