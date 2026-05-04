import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, UserPlus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', assignee: '' });
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}`);
      setProject(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}/tasks`);
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const myRole = project?.members?.find(m => m.user._id === user.id)?.role || 'Member';
  const isAdmin = myRole === 'Admin';

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${id}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', status: 'To Do', assignee: '' });
      fetchTasks();
    } catch (err) { alert(err.response?.data?.message || 'Error creating task'); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${id}/members`, { email: newMemberEmail, role: 'Member' });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProject();
    } catch (err) { alert(err.response?.data?.message || 'Error adding member'); }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await axios.delete(`/api/projects/${id}/members/${memberId}`);
      fetchProject();
    } catch (err) { alert(err.response?.data?.message || 'Error removing member'); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await axios.put(`/api/projects/${id}/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) { alert('Error updating status'); }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`/api/projects/${id}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) { alert('Error deleting task'); }
  };

  if (!project) return <div className="container">Loading...</div>;

  const statuses = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="container">
      <div className="flex justify-between items-start mb-8 border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-3xl mb-2">{project.name}</h1>
          <p className="text-muted">{project.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-muted">
            <span>Role: <strong className={isAdmin ? 'text-primary' : ''}>{myRole}</strong></span>
            <span>Members: {project.members.length}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.members.map(m => (
              <div key={m.user._id} className="status-badge flex items-center gap-2" style={{ backgroundColor: 'var(--bg-surface-hover)', borderColor: 'var(--border)', color: 'var(--text-main)', textTransform: 'none' }}>
                {m.user.name} ({m.role})
                {isAdmin && m.user._id !== user.id && (
                  <button onClick={() => handleRemoveMember(m.user._id)} className="text-danger bg-transparent border-none cursor-pointer font-bold text-sm" title="Remove member" style={{ padding: '0 4px' }}>
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button onClick={() => setShowMemberModal(true)} className="btn btn-secondary flex items-center gap-2"><UserPlus size={16}/> Add Member</button>
              <button onClick={() => setShowTaskModal(true)} className="btn btn-primary flex items-center gap-2"><Plus size={16}/> Add Task</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map(status => (
          <div key={status} className="card" style={{ backgroundColor: 'var(--bg-base)', padding: '1rem' }}>
            <h3 className="text-xl mb-4 font-semibold pb-2 border-b border-[var(--border)]">{status}</h3>
            <div className="flex flex-col gap-4">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="card hoverable p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{task.title}</h4>
                    {isAdmin && <button onClick={() => handleDeleteTask(task._id)} className="text-danger bg-transparent border-none cursor-pointer"><Trash2 size={16}/></button>}
                  </div>
                  <p className="text-sm text-muted mb-4">{task.description}</p>
                  
                  <div className="flex justify-between items-center text-xs mb-4">
                    <span className={`priority-${task.priority.toLowerCase()} font-semibold`}>{task.priority} Priority</span>
                    {task.dueDate && <span className="text-muted">{format(new Date(task.dueDate), 'MMM dd')}</span>}
                  </div>

                  <div className="flex justify-between items-center border-t border-[var(--border)] pt-3">
                    <div className="text-xs text-muted truncate max-w-[120px]">
                      {task.assignee ? task.assignee.name : 'Unassigned'}
                    </div>
                    {(isAdmin || task.assignee?._id === user.id) && (
                      <select 
                        value={task.status} 
                        onChange={e => handleStatusChange(task._id, e.target.value)}
                        className="input text-xs"
                        style={{ width: 'auto', padding: '0.25rem' }}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="text-xl mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label className="label">Title</label>
                <input className="input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Due Date</label>
                  <input type="date" className="input" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="input" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Assignee</label>
                <select className="input" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members.map(m => (
                    <option key={m.user._id} value={m.user._id}>{m.user.name} ({m.user.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 className="text-xl mb-4">Add Member</h2>
            <form onSubmit={handleAddMember} className="flex flex-col gap-4">
              <div>
                <label className="label">User Email</label>
                <input type="email" className="input" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} required />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
