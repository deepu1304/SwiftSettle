import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Receipt, LogOut, Plus, X, Clock, CheckCircle, TrendingUp 
} from 'lucide-react';

// --- Sub-Component: Table Skeleton Loader ---
const TableSkeleton = () => (
  <tr className="animate-pulse-custom">
    <td className="px-8 py-6"><div className="h-5 bg-slate-200 rounded-lg w-3/4"></div></td>
    <td className="px-8 py-6"><div className="h-5 bg-slate-200 rounded-lg w-1/2"></div></td>
    <td className="px-8 py-6"><div className="h-5 bg-slate-200 rounded-lg w-20 ml-auto"></div></td>
    <td className="px-8 py-6"><div className="h-8 bg-slate-200 rounded-full w-24 mx-auto"></div></td>
    <td className="px-8 py-6"><div className="h-5 bg-slate-200 rounded-lg w-5 mx-auto"></div></td>
  </tr>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // --- State ---
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All', 'Pending', 'Settled'
  
  const [formData, setFormData] = useState({
    item: '', category: 'Hardware', amount: '', status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  // --- Logic: Session Management (Logout) ---
  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Wipe session key
    navigate('/', { replace: true });    // Redirect and flush navigation history
  };

  // --- Logic: Dynamic Summary Calculations (Always calculated from raw array) ---
  const totalPending = recentExpenses
    .filter(exp => exp.status === 'Pending')
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const settledToday = recentExpenses
    .filter(exp => exp.status === 'Settled')
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  // --- Logic: Row Filtering Engine ---
  const filteredExpenses = recentExpenses.filter(exp => {
    if (statusFilter === "All") return true;
    return exp.status === statusFilter;
  });

  // --- Utility: Formatters ---
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(num);
  };

  // --- API Integrations ---
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/expenses');
      setRecentExpenses(res.data);
    } catch (err) {
      setServerError("Could not connect to the settlement server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.item || !formData.amount) return;
    try {
      const res = await axios.post('http://localhost:8080/api/expenses', formData);
      setRecentExpenses([res.data, ...recentExpenses]);
      setIsModalOpen(false);
      setFormData({ item: '', category: 'Hardware', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    } catch (err) {
      setServerError("Failed to submit claim. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/expenses/${id}`);
      setRecentExpenses(recentExpenses.filter(exp => exp.id !== id));
    } catch (err) {
      setServerError("Unable to delete. Please refresh.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
            <Receipt className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">SwiftSettle</span>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold bg-slate-900 text-white shadow-xl shadow-slate-200">
            <LayoutDashboard size={22} /> Overview
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100">
            <Receipt size={22} /> My Expenses
          </button>
        </nav>
        {/* Wire up the real logout handler */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 font-bold hover:text-rose-600 mt-auto border-t pt-6 transition-colors"
        >
          <LogOut size={22} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics</h1>
            <p className="text-slate-500 mt-2 font-medium">Tracking your reimbursement pipeline.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-indigo-200 transition-transform active:scale-95">
            <Plus size={22} strokeWidth={3} /> New Expense Claim
          </button>
        </header>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Clock size={28} />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Pending</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(totalPending)}</h3>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="bg-emerald-100 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle size={28} />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Settled Today</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(settledToday)}</h3>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="bg-indigo-100 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={28} />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Monthly Limit</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(150000)}</h3>
          </div>
        </div>

        {/* Expense Table Box */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
            
            {/* --- Interactive Filter Segment Control --- */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
              {['All', 'Pending', 'Settled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                    statusFilter === tab 
                      ? 'bg-white text-slate-950 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-50">
                  <th className="px-8 py-6">Transaction</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <><TableSkeleton /><TableSkeleton /><TableSkeleton /></>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                      No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} claims found.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900">{exp.item}</td>
                      <td className="px-8 py-6 text-slate-500 font-medium">{exp.category}</td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">{formatCurrency(exp.amount)}</td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                          exp.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button onClick={() => handleDelete(exp.id)} className="text-slate-300 hover:text-rose-500 p-2 transition-colors">
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-lg rounded-[48px] p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900">Submit Claim</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase">Item Name</label>
                <input required name="item" value={formData.item} onChange={(e) => setFormData({...formData, item: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase">Amount</label>
                <input required type="number" name="amount" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-none rounded-3xl font-bold" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black shadow-2xl hover:bg-indigo-700">Confirm & Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;