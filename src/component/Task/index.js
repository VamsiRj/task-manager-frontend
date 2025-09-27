import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUserDetails } from '../../context';
 
const Task = ({ task, renderTasks }) => {
  const { userId: adminId } = useUserDetails();
  const deleteTaskApi = `http://localhost:5185/api/tasks/${task.taskId}`;
  const assignTaskToUserApi = `http://localhost:5185/api/task-assignments/${task.taskId}/assign/`;
  const unassignTaskApi = `http://localhost:5185/api/task-assignments/${task.taskId}/unassign/${task.memberId}`;
  const priorityApi = `http://localhost:5185/api/tasks/${task.taskId}/priority`;
  const usersApi = 'http://localhost:5185/api/users';
 
  const [members, setMembers] = useState([]);
  const [assignedUser, setAssignedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
 
  useEffect(() => {
    fetchTeamMembers();
  }, []);
 
  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(usersApi);
      if (response.status === 200) {
        const teamMembers = response.data.filter(
          (ele) => ele.role.toLowerCase() === 'teammember'
        );
        if (task.memberId) {
          const memberObj = teamMembers.find(
            (ele) => ele.userId === task.memberId
          );
          setAssignedUser(memberObj);
        }
        setMembers(teamMembers);
      } else {
        console.log('Something went wrong while fetching users.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
 
  const assignTaskToUser = async (user) => {
    setLoadingUser(user.userId);
    try {
      const response = await axios.post(
        assignTaskToUserApi + user.userId,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            adminId: adminId,
          },
        }
      );
 
      if (response.status === 200) {
        setAssignedUser(user);
        setSelectedMember(user);
        renderTasks();
      } else {
        console.log('Failed to assign task.');
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingUser(null);
    }
  };
 
  const unassignTask = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to unassign this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f57c00',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unassign it!',
      cancelButtonText: 'Cancel',
    });
 
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(unassignTaskApi, {
          headers: {
            'Content-Type': 'application/json',
            adminId: adminId,
          },
        });
 
        if (response.status === 200) {
          Swal.fire('Unassigned!', 'The task has been unassigned.', 'success');
          setAssignedUser(null);
          setSelectedMember(null);
          renderTasks();
        } else {
          Swal.fire('Error', 'Failed to unassign task.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    }
  };
 
  const deleteTask = async () => {
    const status = task.status?.toLowerCase() || '';
 
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text:
        status === 'completed'
          ? 'You are about to delete a completed task.'
          : 'Are you sure you want to delete it?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
 
    if (!confirm.isConfirmed) return;
 
    try {
      const response = await axios.delete(deleteTaskApi, {
        headers: { Accept: '*/*', adminId: adminId },
      });
 
      if (response.status === 200) {
        Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        renderTasks();
      } else {
        Swal.fire('Error', 'Task deletion failed.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };
 
  const updatePriority = async (newPriority) => {
    try {
      const response = await axios.put(priorityApi, newPriority, {
        headers: {
          'Content-Type': 'application/json',
          adminId: adminId,
        },
      });
 
      if (response.status === 200) {
        renderTasks();
      } else {
        console.log('Failed to update priority.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
 
  return (
    <div className={`admin-dashboard-task-card ${task.status === 'In Progress' ? 'in-progress' : 'pending'}`}>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p><strong>Target Date:</strong> {new Date(task.targetDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {task.status}</p>
 
      <p>
        <strong>Priority:</strong>
        <select
          value={task.priority}
          onChange={(e) => updatePriority(e.target.value)}
        >
          <option value='high'>High</option>
          <option value='medium'>Medium</option>
          <option value='low'>Low</option>
        </select>
      </p>
 
      <p><strong>Tags:</strong> {task.tags}</p>
      <p><strong>Assigned to:</strong> {assignedUser ? assignedUser.username : 'None'}</p>
 
      {!assignedUser ? (
        <div>
          <strong>Assign Task:</strong>
          <select
            value={selectedMember ? selectedMember.userId : ''}
            onChange={(e) => {
              const selected = e.target.value
                ? members.find((member) => member.userId === parseInt(e.target.value))
                : null;
              if (selected) assignTaskToUser(selected);
              else unassignTask();
            }}
            style={{
              padding: '8px',
              marginTop: '10px',
              borderRadius: '5px',
              fontSize: '14px',
            }}
          >
            <option value='' disabled>Select a Team Member</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.username}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          onClick={unassignTask}
          style={{
            backgroundColor: 'orange',
            padding: '8px',
            color: 'white',
            borderRadius: '5px',
            marginTop: '10px',
          }}
        >
          Unassign Task
        </button>
      )}
 
      <button
        onClick={deleteTask}
        style={{
          marginTop: '10px',
          backgroundColor: 'red',
          padding: '8px',
          color: 'white',
          borderRadius: '5px',
        }}
      >
        Delete Task
      </button>
    </div>
  );
};
 
export default Task;
 
 