import { useState, useEffect } from 'react';
import { getHousekeeping, updateHousekeeping } from '../services/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { Sparkles, CheckCircle, Clock, AlertTriangle, Wrench, User, Edit2 } from 'lucide-react';

const HK_STATUSES = ['Clean', 'Dirty', 'Cleaning', 'Inspected', 'Maintenance'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const STAFF_LIST = ['Maria Lopez', 'James Cook', 'Anna White', 'Carlos Rodriguez', 'Sophie Turner', 'Unassigned'];

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getHousekeeping();
      setTasks(res.data);
    } catch { toast.error('Failed to load housekeeping tasks'); }
    finally { setLoading(false); }
  };

  const openEdit = (task) => {
    setEditForm({ assignedTo: task.assignedTo, status: task.status, priority: task.priority, notes: task.notes || '' });
    setEditTask(task);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editForm };
      if (editForm.status === 'Clean' || editForm.status === 'Inspected') {
        payload.lastCleaned = new Date().toISOString();
      }
      const res = await updateHousekeeping(editTask._id, payload);
      setTasks(t => t.map(x => x._id === editTask._id ? res.data : x));
      toast.success('Task updated!');
      setEditTask(null);
    } catch { toast.error('Failed to update task'); }
    finally { setSaving(false); }
  };

  const quickStatus = async (task, status) => {
    try {
      const payload = { status };
      if (status === 'Clean' || status === 'Inspected') payload.lastCleaned = new Date().toISOString();
      const res = await updateHousekeeping(task._id, payload);
      setTasks(t => t.map(x => x._id === task._id ? res.data : x));
      toast.success(`Marked as ${status}`);
    } catch { toast.error('Update failed'); }
  };

  const stats = {
    dirty: tasks.filter(t => t.status === 'Dirty').length,
    cleaning: tasks.filter(t => t.status === 'Cleaning').length,
    clean: tasks.filter(t => t.status === 'Clean' || t.status === 'Inspected').length,
    maintenance: tasks.filter(t => t.status === 'Maintenance').length,
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not yet';

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Housekeeping</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage room cleaning schedules and assignments.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Rooms to Clean', value: stats.dirty, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'In Progress', value: stats.cleaning, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Completed', value: stats.clean, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Maintenance', value: stats.maintenance, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-sm font-semibold text-gray-700">{tasks.length} Tasks</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                {['Room', 'Type', 'Assigned To', 'Last Cleaned', 'Priority', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    {[...Array(7)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}
                  </tr>
                ))
              ) : tasks.map(task => (
                <tr key={task._id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold">
                        {task.room?.roomNumber || '?'}
                      </div>
                      <span className="font-medium text-gray-800 text-xs">Room {task.room?.roomNumber}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{task.room?.type || '-'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{task.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{fmt(task.lastCleaned)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={task.priority} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={task.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      {task.status === 'Dirty' && (
                        <button onClick={() => quickStatus(task, 'Cleaning')} className="text-[10px] bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-1 rounded-lg font-medium hover:bg-yellow-100 transition-colors whitespace-nowrap">
                          Start
                        </button>
                      )}
                      {task.status === 'Cleaning' && (
                        <button onClick={() => quickStatus(task, 'Clean')} className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-lg font-medium hover:bg-green-100 transition-colors whitespace-nowrap">
                          Done
                        </button>
                      )}
                      <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !tasks.length && (
            <div className="flex flex-col items-center py-16">
              <Sparkles className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No housekeeping tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title={`Housekeeping — Room ${editTask?.room?.roomNumber}`} size="sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Assign To</label>
            <select value={editForm.assignedTo} onChange={e => setEditForm({ ...editForm, assignedTo: e.target.value })} className="input-field">
              {STAFF_LIST.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Status</label>
            <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="input-field">
              {HK_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
            <select value={editForm.priority} onChange={e => setEditForm({ ...editForm, priority: e.target.value })} className="input-field">
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
            <textarea value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} rows={2} className="input-field resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditTask(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Housekeeping;
