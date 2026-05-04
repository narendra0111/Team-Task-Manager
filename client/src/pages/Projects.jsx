import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', { name, description });
      setShowModal(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl flex items-center gap-2"><FolderKanban /> Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(p => (
          <Link to={`/projects/${p._id}`} key={p._id} className="card hoverable">
            <h3 className="text-xl mb-2">{p.name}</h3>
            <p className="text-muted text-sm mb-4">{p.description}</p>
            <div className="text-xs text-muted flex justify-between items-center border-t border-[var(--border)] pt-4 mt-4">
              <span>{p.members.length} members</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-muted">No projects found. Create one!</p>}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '400px' }}>
            <h2 className="text-xl mb-4">Create Project</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="label">Project Name</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
