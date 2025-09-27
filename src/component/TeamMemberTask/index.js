import React, { useState } from 'react';
import axios from 'axios';
import { useUserDetails } from '../../context';
import './index.css';

const TeamMemberTask = ({ task, renderTasks }) => {
  const { userId: empId } = useUserDetails();
  const statusApi = `http://localhost:5185/api/task-assignments/${task.taskId}/status`;

  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [isDelayed, setIsDelayed] = useState(false);

  const updateStatus = async (newStatus) => {
    try {
      const response = await axios.put(statusApi, newStatus, {
        headers: {
          'Content-Type': 'application/json',
          userId: empId,
        },
      });

      if (response.status === 200) {
        setSelectedStatus(newStatus);

        if (newStatus === 'Completed' && isDelayed && delayReason.trim() !== '') {
          localStorage.setItem(`delay_reason_${task.taskId}`, delayReason);
        }

        renderTasks();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;

    if (newStatus === 'Completed') {
      const today = new Date().toISOString().split('T')[0];
      const target = new Date(task.targetDate).toISOString().split('T')[0];

      setIsDelayed(today > target);
      setPendingStatus(newStatus);
      setShowConfirmBox(true);
    } else {
      updateStatus(newStatus);
    }
  };

  const confirmCompletion = () => {
    updateStatus(pendingStatus);
    setShowConfirmBox(false);
    setDelayReason('');
  };

  return (
    <div className="admin-dashboard-task-card" style={{ position: 'relative' }}>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p><strong>Target Date:</strong> {new Date(task.targetDate).toLocaleDateString()}</p>
      <p>
        <strong>Status:</strong>{' '}
        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value='Pending'>Pending</option>
          <option value='In Progress'>In Progress</option>
          <option value='Completed'>Completed</option>
          <option value='Not Yet Started'>Not Yet Started</option>
        </select>
      </p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Tags:</strong> {task.tags}</p>
      <p><strong>Assigned By:</strong> {task.ownerName || 'Unknown'}</p>

      {showConfirmBox && (
        <div className="confirm-box">
          {isDelayed ? (
            <>
              <p>This task is being completed after the target date.</p>
              <textarea
                rows={3}
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Enter reason for delay"
                style={{ width: '100%', borderRadius: '5px', padding: '5px' }}
              />
            </>
          ) : (
            <p>Are you sure you want to mark this task as completed?</p>
          )}

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              onClick={confirmCompletion}
              disabled={isDelayed && delayReason.trim() === ''}
              style={{
                backgroundColor: isDelayed && delayReason.trim() === '' ? '#ccc' : '#4CAF50',
                color: isDelayed && delayReason.trim() === '' ? '#666' : 'white',
                cursor: isDelayed && delayReason.trim() === '' ? 'not-allowed' : 'pointer',
              }}
            >
              Confirm
            </button>
            <button onClick={() => setShowConfirmBox(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMemberTask;
