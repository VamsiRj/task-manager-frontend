import React, { useState } from 'react';
import { useUserDetails } from '../../context';

const TeamMemberTask = ({ task, renderTasks }) => {
  const { userId: empId } = useUserDetails();
  console.log('task', task);
  const statusApi = `http://localhost:5185/api/task-assignments/${task.taskId}/status`;

  const [selectedStatus, setSelectedStatus] = useState(task.status);

  // Function to update task status
  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(statusApi, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          userId: empId,
        },
        body: JSON.stringify(newStatus),
      });

      if (response.ok) {
        setSelectedStatus(newStatus);
        renderTasks();
      } else {
        console.log('Failed to update status.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`admin-dashboard-task-card ${
        task.status === 'In Progress' ? 'in-progress' : 'pending'
      }`}
    >
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>
        <strong>Target Date:</strong>{' '}
        {new Date(task.targetDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong>{' '}
        <select
          style={{
            color: 'black',
            outline: 'none',
            border: 'none',
            fontSize: '15px',
            backgroundColor: '#f1f8e9',
            boxShadow: '1px 1px 0px 0px #b2e3a9',
          }}
          value={selectedStatus}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value='Pending'>Pending</option>
          <option value='In Progress'>In Progress</option>
          <option value='Completed'>Completed</option>
          <option value='Not Yet Started'>Not Yet Started</option>
        </select>
      </p>

      <p>
        <strong>Priority:</strong> {task.priority}
      </p>

      <p>
        <strong>Tags:</strong> {task.tags}
      </p>

      {/* Display Assigned By instead of Assigned To */}
      <p>
        <strong>Assigned By:</strong> {task.ownerName || 'Unknown'}
      </p>
    </div>
  );
};

export default TeamMemberTask;
