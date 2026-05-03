import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Receipt, Users, Settings, LogOut, 
  Plus, Search, Filter, TrendingUp, Clock, CheckCircle, X, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  // --- State Management ---
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    item: '',
    category: 'Hardware',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  });

  // --- Utility: Currency Formatter ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // --- Logic: Fetch Data ---
  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/expenses');
      setRecentExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Connection failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- Logic: Validation & Submission ---
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.item.trim()) tempErrors.item = "Please enter what this expense was for.";
    if (!formData.amount) {
      tempErrors.amount = "Please enter an amount.";
    } else if (parseFloat(formData.amount) <= 0) {
      tempErrors.amount = "Amount must be greater than zero.";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific field error as user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:8080/api/expenses', formData);
      setRecentExpenses([response.data, ...recentExpenses]);
      setIsModalOpen(false);
      setFormData({ item: '', category: 'Hardware', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      // User-friendly error message
      setServerError("We couldn't save your claim right now. Please try again in a moment.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/expenses/${id}`);
      setRecentExpenses(recentExpenses.filter(exp => exp.id !== id));
    } catch (error) {
      setServerError("Could not delete this item. Please refresh and try again.");
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
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Analytics</h1>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">Your reimbursement pipeline is healthy.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-indigo-200 transition-transform active:scale-95"
          >
            <Plus size={22} strokeWidth={3} /> New Expense Claim
          </button>
        </header>

        {/* Expense Table */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-50">
                  <th className="px-8 py-6">Transaction Details</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentExpenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                      No expenses found. Your settlements will appear here.
                    </td>
                  </tr>
                ) : (
                  recentExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-900">{exp.item}</td>
                      <td className="px-8 py-6 text-slate-500 font-medium">{exp.category}</td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          exp.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button onClick={() => handleDelete(exp.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2">
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

      {/* --- User-Facing Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
          <div className="bg-white w-full max-w-lg rounded-[48px] p-12 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Submit Claim</h2>
              <button onClick={() => {setIsModalOpen(false); setErrors({}); setServerError("");}} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={28} />
              </button>
            </div>

            {serverError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                <AlertCircle size={18} /> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.15em]">Item Description</label>
                <input 
                  name="item" value={formData.item} onChange={handleChange}
                  className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-3xl outline-none transition-all font-bold text-slate-900 ${
                    errors.item ? 'border-rose-300 focus:ring-rose-100' : 'border-transparent focus:ring-indigo-500/10'
                  }`}
                  placeholder="e.g. Flight to Mumbai Office"
                />
                {errors.item && <p className="text-rose-500 text-[11px] font-bold mt-3 ml-2">{errors.item}</p>}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.15em]">Amount</label>
                  <input 
                    name="amount" type="number" value={formData.amount} onChange={handleChange}
                    className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-3xl outline-none transition-all font-bold text-slate-900 ${
                      errors.amount ? 'border-rose-300 focus:ring-rose-100' : 'border-transparent focus:ring-indigo-500/10'
                    }`}
                    placeholder="₹"
                  />
                  {errors.amount && <p className="text-rose-500 text-[11px] font-bold mt-3 ml-2">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.15em]">Category</label>
                  <select 
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-6 py-5 bg-slate-50 border-transparent border-2 rounded-3xl outline-none font-bold text-slate-900 appearance-none focus:ring-indigo-500/10 transition-all"
                  >
                    <option>Hardware</option>
                    <option>Meals</option>
                    <option>Travel</option>
                    <option>Software</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-4xl font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                Confirm & Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;