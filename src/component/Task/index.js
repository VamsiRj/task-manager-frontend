// import React, { useState, useEffect } from 'react';
// import { useUserDetails } from '../../context';

// const Task = ({ task, renderTasks }) => {
//   const { userId: adminId } = useUserDetails();
//   const deleteTaskApi = `http://localhost:5185/api/tasks/${task.taskId}`;
//   const assignTaskToUserApi = `http://localhost:5185/api/task-assignments/${task.taskId}/assign/`;
//   const unassignTaskApi = `http://localhost:5185/api/task-assignments/${task.taskId}/unassign/${task.memberId}`;
//   const usersApi = 'http://localhost:5185/api/users';

//   const [members, setMembers] = useState([]);
//   const [showMembers, setShowMembers] = useState(false);
//   const [assignedUser, setAssignedUser] = useState(task.memberId);
//   const [loadingUser, setLoadingUser] = useState(null);

//   useEffect(() => {
//     fetchTeamMembers();
//   }, []);

//   const fetchTeamMembers = async () => {
//     try {
//       const response = await fetch(usersApi);
//       const data = await response.json();
//       if (response.ok) {
//         const teamMembers = data.filter(
//           (ele) => ele.role.toLowerCase() === 'teammember'
//         );
//         setMembers(teamMembers);

//         // Check if task is already assigned
//         if (task.assignedTo) {
//           const assignedMember = teamMembers.find(
//             (member) => member.userId === task.assignedTo
//           );
//           if (assignedMember) setAssignedUser(assignedMember);
//         }
//       } else {
//         console.log('Something went wrong while fetching users.');
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const assignTaskToUser = async (user) => {
//     setLoadingUser(user.userId); // Show loader on selected user

//     try {
//       const response = await fetch(assignTaskToUserApi + user.userId, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           adminId: adminId,
//         },
//       });

//       if (response.ok) {
//         setAssignedUser(user);
//         setShowMembers(false);
//         renderTasks();
//       } else {
//         console.log('Failed to assign task.');
//       }
//     } catch (error) {
//       console.log(error.message);
//     } finally {
//       setLoadingUser(null); // Remove loader after assignment
//     }
//   };

//   const unassignTask = async () => {
//     try {
//       const response = await fetch(unassignTaskApi, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           adminId: adminId,
//         },
//       });

//       if (response.ok) {
//         setAssignedUser(null);
//         renderTasks();
//       } else {
//         console.log('Failed to unassign task.');
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const deleteTask = async () => {
//     try {
//       const response = await fetch(deleteTaskApi, {
//         method: 'DELETE',
//         headers: { Accept: '*/*', adminId: adminId },
//       });

//       if (response.ok) {
//         renderTasks();
//       } else {
//         console.log('Task deletion failed.');
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   return (
//     <div
//       className={`admin-dashboard-task-card ${
//         task.status === 'In Progress' ? 'in-progress' : 'pending'
//       }`}
//     >
//       <h3>{task.name}</h3>
//       <p>{task.description}</p>
//       <p>
//         <strong>Target Date:</strong>{' '}
//         {new Date(task.targetDate).toLocaleDateString()}
//       </p>
//       <p>
//         <strong>Status:</strong> {task.status}
//       </p>
//       <p>
//         <strong>Priority:</strong> {task.priority}
//       </p>
//       <p>
//         <strong>Tags:</strong> {task.tags}
//       </p>

//       {/* Assigned User */}
//       {assignedUser ? (
//         <p>
//           <strong>Assigned to:</strong> {assignedUser.username}
//         </p>
//       ) : (
//         <p>
//           <strong>Assigned to:</strong> None
//         </p>
//       )}

//       {/* Assign & Unassign Task Buttons */}
//       {!assignedUser ? (
//         <button onClick={() => setShowMembers(!showMembers)}>
//           Assign Task
//         </button>
//       ) : (
//         <button
//           onClick={unassignTask}
//           style={{ backgroundColor: 'orange', color: 'white' }}
//         >
//           Unassign Task
//         </button>
//       )}

//       {/* Team Members List */}
//       {showMembers && (
//         <div
//           style={{
//             marginTop: '10px',
//             padding: '10px',
//             border: '1px solid #ccc',
//           }}
//         >
//           <h4>Select a Team Member:</h4>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//             {members.length > 0 ? (
//               members.map((member) => (
//                 <div
//                   key={member.userId}
//                   onClick={() => assignTaskToUser(member)}
//                   style={{
//                     padding: '10px 15px',
//                     border: '1px solid #ccc',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     backgroundColor:
//                       loadingUser === member.userId ? '#ccc' : '#f9f9f9',
//                     transition: 'background-color 0.3s ease',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   {loadingUser === member.userId
//                     ? '⏳ Assigning...'
//                     : member.username}
//                 </div>
//               ))
//             ) : (
//               <p>No Team Members available.</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Delete Task Button */}
//       <button
//         onClick={deleteTask}
//         style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}
//       >
//         Delete Task
//       </button>
//     </div>
//   );
// };

// export default Task;

import React, { useState, useEffect } from 'react';
import { useUserDetails } from '../../context';

const Task = ({ task, renderTasks }) => {
  const { userId: adminId } = useUserDetails();
  const deleteTaskApi = `http://localhost:5185/api/tasks/${task.taskId}`;
  const assignTaskToUserApi = `http://localhost:5185/api/task-assignments/${task.taskId}/assign/`;
  const unassignTaskApi = `http://localhost:5185/api/task-assignments/${task.taskId}/unassign/${task.memberId}`;
  const priorityApi = `http://localhost:5185/api/tasks/${task.taskId}/priority`;
  const usersApi = 'http://localhost:5185/api/users';

  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [assignedUser, setAssignedUser] = useState(task.memberId);
  const [loadingUser, setLoadingUser] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(task.priority);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(usersApi);
      const data = await response.json();
      if (response.ok) {
        const teamMembers = data.filter(
          (ele) => ele.role.toLowerCase() === 'teammember'
        );
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
      const response = await fetch(assignTaskToUserApi + user.userId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          adminId: adminId,
        },
      });

      if (response.ok) {
        setAssignedUser(user);
        setShowMembers(false);
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
    try {
      const response = await fetch(unassignTaskApi, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          adminId: adminId,
        },
      });

      if (response.ok) {
        setAssignedUser(null);
        renderTasks();
      } else {
        console.log('Failed to unassign task.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await fetch(deleteTaskApi, {
        method: 'DELETE',
        headers: { Accept: '*/*', adminId: adminId },
      });

      if (response.ok) {
        renderTasks();
      } else {
        console.log('Task deletion failed.');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updatePriority = async (newPriority) => {
    try {
      const response = await fetch(priorityApi, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          adminId: adminId,
        },
        body: JSON.stringify(newPriority),
      });

      if (response.ok) {
        setSelectedPriority(newPriority);
        renderTasks();
      } else {
        console.log('Failed to update priority.');
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
        <strong>Status:</strong> {task.status}
      </p>

      {/* Priority Dropdown */}
      <p>
        <strong>Priority:</strong>{' '}
        <select
          style={{
            color: 'black',
            outline: 'none',
            border: 'none',
            fontSize: '15px',
            backgroundColor: '#f1f8e9',
            boxShadow: '1px 1px 0px 0px #b2e3a9',
          }}
          value={selectedPriority}
          onChange={(e) => updatePriority(e.target.value)}
        >
          <option value='high'>High</option>
          <option value='medium'>Medium</option>
          <option value='low'>Low</option>
        </select>
      </p>

      <p>
        <strong>Tags:</strong> {task.tags}
      </p>

      {/* Assigned User */}
      {assignedUser ? (
        <p>
          <strong>Assigned to:</strong> {assignedUser.username}
        </p>
      ) : (
        <p>
          <strong>Assigned to:</strong> None
        </p>
      )}

      {/* Assign & Unassign Task Buttons */}
      {!assignedUser ? (
        <button
          onClick={() => setShowMembers(!showMembers)}
          style={{
            backgroundColor: 'steelblue',
            padding: '5px',
            color: 'white',
            borderRadius: '5px',
            marginRight: '5px',
          }}
        >
          Assign Task
        </button>
      ) : (
        <button
          onClick={unassignTask}
          style={{
            backgroundColor: 'orange',
            padding: '5px',
            color: 'white',
            borderRadius: '5px',
            marginRight: '5px',
          }}
        >
          Unassign Task
        </button>
      )}

      {/* Team Members List */}
      {showMembers && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          <h4>Select a Team Member:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.userId}
                  onClick={() => assignTaskToUser(member)}
                  style={{
                    padding: '10px 15px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor:
                      loadingUser === member.userId ? '#ccc' : '#f9f9f9',
                    transition: 'background-color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {loadingUser === member.userId
                    ? '⏳ Assigning...'
                    : member.username}
                </div>
              ))
            ) : (
              <p>No Team Members available.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Task Button */}
      <button
        onClick={deleteTask}
        style={{
          marginTop: '10px',
          backgroundColor: 'red',
          padding: '5px',
          color: 'white',
          borderRadius: '5px',
          marginRight: '5px',
        }}
      >
        Delete Task
      </button>
    </div>
  );
};

export default Task;
