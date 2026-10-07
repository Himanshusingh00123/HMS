import { useState, useEffect } from 'react';
import { getFoods, getOrders, updateOrder, createFood, deleteFood } from '../services/api';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { Plus, Star, Utensils, ShoppingBag, Edit2, Trash2, Filter, ChefHat } from 'lucide-react';

const CATEGORIES = ['All', 'Pizza', 'Pasta', 'Desserts', 'Drinks', 'Burger', 'Main Course', 'Salad', 'Seafood'];
const ORDER_STATUSES = ['New', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

const emptyFood = { name: '', category: 'Main Course', price: 0, rating: 4.5, image: '', description: '' };

const Restaurant = () => {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [tab, setTab] = useState('menu');
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(emptyFood);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { fetchFoods(); }, [category]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [fRes, oRes] = await Promise.all([getFoods({ category: category !== 'All' ? category : undefined }), getOrders()]);
      setFoods(fRes.data);
      setOrders(oRes.data);
    } catch { toast.error('Failed to load restaurant data'); }
    finally { setLoading(false); }
  };

  const fetchFoods = async () => {
    try {
      const params = category !== 'All' ? { category } : {};
      const res = await getFoods(params);
      setFoods(res.data);
    } catch {}
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error('Name and price are required');
    setSaving(true);
    try {
      const res = await createFood(form);
      setFoods(f => [res.data, ...f]);
      toast.success('Food item added!');
      setAddModal(false);
      setForm(emptyFood);
    } catch (err) { toast.error(err.response?.data?.message || 'Error adding food'); }
    finally { setSaving(false); }
  };

  const handleDeleteFood = async () => {
    try {
      await deleteFood(deleteId);
      setFoods(f => f.filter(x => x._id !== deleteId));
      toast.success('Food item deleted');
      setDeleteId(null);
    } catch { toast.error('Failed to delete'); }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      const res = await updateOrder(orderId, { status });
      setOrders(o => o.map(x => x._id === orderId ? res.data : x));
      toast.success(`Order marked as ${status}`);
    } catch { toast.error('Failed to update order'); }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage menu items and room service orders.</p>
        </div>
        <button onClick={() => { setForm(emptyFood); setAddModal(true); }} className="btn-primary whitespace-nowrap">
          <Plus className="w-4 h-4" /> Add Food Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100 shadow-card w-fit">
        {[{ key: 'menu', label: 'Menu', icon: Utensils }, { key: 'orders', label: 'Orders', icon: ShoppingBag }].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon className="w-4 h-4" /> {label}
            {key === 'orders' && orders.filter(o => o.status === 'New').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {orders.filter(o => o.status === 'New').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'menu' ? (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border flex-shrink-0 ${category === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/30'}`}
              >{cat}</button>
            ))}
          </div>

          {/* Food Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card animate-pulse"><div className="h-36 bg-gray-100" /><div className="p-3 space-y-2"><div className="h-4 bg-gray-100 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {foods.map(food => (
                <div key={food._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <button onClick={() => setDeleteId(food._id)} className="w-6 h-6 bg-white/90 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-0.5 rounded-full">{food.category}</span>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">{food.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{food.rating}</span>
                      </div>
                      <span className="text-sm font-bold text-primary">${food.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !foods.length && (
            <div className="flex flex-col items-center py-20">
              <ChefHat className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">No food items found</p>
            </div>
          )}
        </>
      ) : (
        /* Orders Tab */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">{orders.length} Orders</p>
            <div className="flex gap-1">
              {['New', 'Preparing'].map(s => (
                <span key={s} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {orders.filter(o => o.status === s).length} {s}
                </span>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  {['Order #', 'Guest', 'Room', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">#{order.orderNumber}</td>
                    <td className="px-5 py-3.5 text-gray-700 text-xs font-medium">{order.guestName}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{order.roomNumber || '-'}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{order.items?.map(i => `${i.name}×${i.quantity}`).join(', ')}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 text-xs">${order.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        onChange={e => handleOrderStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 outline-none focus:border-primary transition-colors"
                      >
                        {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length && (
              <div className="flex flex-col items-center py-16">
                <ShoppingBag className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Food Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Food Item" size="md">
        <form onSubmit={handleAddFood} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Grilled Salmon" className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Price ($)</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rating (0-5)</label>
              <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="input-field resize-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddModal(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary justify-center">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Food */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Food Item" size="sm">
        <div className="text-center py-2">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 className="w-5 h-5 text-red-500" /></div>
          <p className="text-gray-600 text-sm mb-5">Remove this item from the menu?</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary justify-center">Cancel</button>
            <button onClick={handleDeleteFood} className="flex-1 btn-danger justify-center text-sm font-medium">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Restaurant;
