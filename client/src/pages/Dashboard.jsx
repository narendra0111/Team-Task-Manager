import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/dashboard').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1 className="text-3xl mb-8 flex items-center gap-2">
        <LayoutDashboard /> Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center hoverable">
          <p className="text-muted mb-2 text-sm uppercase font-semibold tracking-wider">Total Tasks</p>
          <p className="text-3xl font-bold" style={{color: 'var(--primary)'}}>{stats.totalTasks}</p>
        </div>
        <div className="card text-center hoverable">
          <p className="text-muted mb-2 text-sm uppercase font-semibold tracking-wider">In Progress</p>
          <p className="text-3xl font-bold" style={{color: 'var(--warning)'}}>{stats.byStatus['In Progress']}</p>
        </div>
        <div className="card text-center hoverable">
          <p className="text-muted mb-2 text-sm uppercase font-semibold tracking-wider">Done</p>
          <p className="text-3xl font-bold" style={{color: 'var(--success)'}}>{stats.byStatus['Done']}</p>
        </div>
        <div className="card text-center hoverable">
          <p className="text-muted mb-2 text-sm uppercase font-semibold tracking-wider flex items-center justify-center gap-1">
            <AlertTriangle size={14}/> Overdue
          </p>
          <p className="text-3xl font-bold text-danger">{stats.overdueTasks}</p>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="text-xl mb-4">My Work</h2>
        <p className="text-muted">You have <strong className="text-main" style={{color: 'var(--primary)'}}>{stats.assignedToMe}</strong> tasks assigned to you across all projects.</p>
      </div>
    </div>
  );
}
