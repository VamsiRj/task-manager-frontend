import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import { useUserDetails } from '../../context';
import Task from '../Task';
import TeamMemberTask from '../TeamMemberTask';
import axios from 'axios';
import './index.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const { role, userId: empId, setUserId, setUserRole } = useUserDetails();

  const logout = () => {
    setUserId(null);
    setUserRole('');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/login', { replace: true });
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTasks = async () => {
    try {
      const [tasksResponse, taskAssignmentsResponse, usersResponse] = await Promise.all([
        axios.get('http://localhost:5185/api/tasks'),
        axios.get('http://localhost:5185/api/task-assignments/all'),
        axios.get('http://localhost:5185/api/users'),
      ]);

      const data = tasksResponse.data;
      const taskAssignments = taskAssignmentsResponse.data;
      const users = usersResponse.data;

      const enrichedTasks = data.map((task) => {
        const assignment = taskAssignments.find((item) => task.taskId === item.taskId);
        const owner = users.find((emp) => emp.userId === task.ownerId);
        const member = users.find((emp) => emp.userId === assignment?.userId);
        return {
          ...task,
          memberId: assignment?.userId,
          memberName: member?.username || '',
          ownerName: owner?.username || '',
        };
      });

      setTasks(enrichedTasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  if (loading) {
    return (
      <div className='admin-dashboard-loader-container'>
        <TailSpin color='#4CAF50' height={80} width={80} />
      </div>
    );
  }

  const formatDate = (inputDate) => {
    try {
      const dateObj = new Date(inputDate);
      if (isNaN(dateObj)) return '';
      return dateObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(search.toLowerCase()) ||
      task.priority.toLowerCase().includes(search.toLowerCase()) ||
      task.status.toLowerCase().includes(search.toLowerCase()) ||
      task.tags.toLowerCase().includes(search.toLowerCase()) ||
      task.memberName.toLowerCase().includes(search.toLowerCase());

    const taskDate = task.targetDate ? formatDate(task.targetDate) : '';
    const matchesDate = filterDate ? taskDate === filterDate : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className='admin-dashboard-container'>
      <header className='admin-dashboard-header'>
        <div>
          <h1>Task Dashboard</h1>
          {role === 'Admin' && (
            <h2 className='admin-greeting'>
              Hello Admin {getGreeting()}!
            </h2>
          )}
        </div>
        <button className='logout-btn' onClick={logout}>
          Logout
        </button>
      </header>

      <div className='search-container'>
        <input
          placeholder='Search by task name, priority, status, tags, or team member'
          type='search'
          className='styled-input'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type='date'
          className='styled-date-input'
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {role === 'Admin' && (
          <button
            className='create-task-btn'
            onClick={() => navigate('/create-task')}
          >
            + Create Task
          </button>
        )}
      </div>

      {error && <p className='admin-dashboard-error-message'>{error}</p>}

      <div className='admin-dashboard-task-list'>
        {role === 'Admin' &&
          filteredTasks.map((task) => {
            const today = new Date().toISOString().split('T')[0];
            const target = new Date(task.targetDate).toISOString().split('T')[0];
            const delayReason = localStorage.getItem(`delay_reason_${task.taskId}`);

            return (
              <div key={task.taskId} className="admin-dashboard-task-card-wrapper">
                <Task task={task} renderTasks={getTasks} />
                {task.status === 'Completed' && today > target && delayReason && (
                  <p style={{
                    color: '#c0392b',
                    marginTop: '8px',
                    fontStyle: 'italic',
                    backgroundColor: '#f9e6e6',
                    padding: '8px',
                    borderRadius: '6px'
                  }}>
                    <strong>Delay Reason:</strong> {delayReason}
                  </p>
                )}
              </div>
            );
          })}

        {role !== 'Admin' &&
          filteredTasks
            .filter((task) => task.memberId === empId)
            .map((task) => (
              <TeamMemberTask key={task.taskId} task={task} renderTasks={getTasks} />
            ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
