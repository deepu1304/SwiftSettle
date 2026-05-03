import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Receipt, Users, Settings, LogOut, 
  Plus, Search, Filter, TrendingUp, Clock, CheckCircle, X 
} from 'lucide-react';

const Dashboard = () => {
  // --- State Management ---
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State for New Claims
  const [formData, setFormData] = useState({
    item: '',
    category: 'Hardware',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  // --- Logic: Fetch Data from Spring Boot ---
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/expenses');
      setRecentExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Backend Connection Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- Logic: Handle Submission ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST logic to Spring Boot
      const response = await axios.post('http://localhost:8080/api/expenses', formData);
      
      // Update UI instantly with the new data from DB
      setRecentExpenses([response.data, ...recentExpenses]);
      
      // Reset & Close
      setIsModalOpen(false);
      setFormData({ item: '', category: 'Hardware', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      alert("Failed to save expense. Is the Backend running?");
    }
  };

  // --- Logic: Delete Entry ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/expenses/${id}`);
      setRecentExpenses(recentExpenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Delete failed");
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
        <button className="flex items-center gap-4 px-5 py-4 text-slate-400 font-bold hover:text-red-600 mt-auto border-t pt-6">
          <LogOut size={22} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-2 font-medium">Real-time expense tracking and settlement.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-indigo-200 transition-transform active:scale-95"
          >
            <Plus size={22} strokeWidth={3} /> New Expense Claim
          </button>
        </header>

        {/* Expense Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 uppercase text-xs font-black tracking-widest border-b border-slate-50">
                  <th className="px-8 py-6">Item</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900">{exp.item}</td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{exp.category}</td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">₹{exp.amount}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                        exp.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button onClick={() => handleDelete(exp.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* --- Elegant Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">New Claim</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Expense Name</label>
                <input 
                  required name="item" value={formData.item} onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                  placeholder="e.g. Travel to Client Site"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Amount</label>
                  <input 
                    required name="amount" type="number" value={formData.amount} onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
                    placeholder="₹"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Category</label>
                  <select 
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium appearance-none"
                  >
                    <option>Hardware</option>
                    <option>Meals</option>
                    <option>Travel</option>
                    <option>Software</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-black transition-all active:scale-95">
                Submit Claim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;