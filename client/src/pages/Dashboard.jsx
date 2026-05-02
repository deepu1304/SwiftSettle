import React from 'react';
import { 
  LayoutDashboard, Receipt, Users, Settings, LogOut, 
  Plus, Search, Filter, TrendingUp, Clock, CheckCircle 
} from 'lucide-react';

const Dashboard = () => {
  const userName = "Ishika"; // This will be dynamic later

  const stats = [
    { label: 'Total Pending', value: '₹42,500', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Settled Today', value: '₹12,800', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Monthly Limit', value: '₹1,50,000', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const recentExpenses = [
    { id: 1, item: 'MacBook Pro Charger', category: 'Hardware', amount: '₹6,400', status: 'Pending', date: 'Oct 24, 2025' },
    { id: 2, item: 'Client Lunch - Taj', category: 'Meals', amount: '₹4,200', status: 'Settled', date: 'Oct 23, 2025' },
    { id: 3, item: 'Uber to Airport', category: 'Travel', amount: '₹1,200', status: 'Rejected', date: 'Oct 22, 2025' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar - Fixed Glass Design */}
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100">
            <Receipt className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">SwiftSettle</span>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: Receipt, label: 'My Expenses', active: false },
            { icon: Users, label: 'Approvals', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${item.active ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
              <item.icon size={22} strokeWidth={item.active ? 2.5 : 2} />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-5 py-4 text-slate-400 font-bold hover:text-red-600 transition-colors mt-auto border-t border-slate-100 pt-6">
          <LogOut size={22} /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hello, {userName}</h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your corporate reimbursements efficiently.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-indigo-200 transition-transform active:scale-95">
            <Plus size={22} strokeWidth={3} /> New Expense Claim
          </button>
        </header>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={28} />
              </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Dynamic Expense Table Section */}
        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
            <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search..." className="pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64" />
              </div>
              <button className="p-2.5 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 uppercase text-xs font-black tracking-widest border-b border-slate-50">
                  <th className="px-8 py-6">Expense Details</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6 text-right">Amount</th>
                  <th className="px-8 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 font-bold text-slate-900">{exp.item}</td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{exp.category}</td>
                    <td className="px-8 py-6 text-slate-400 font-medium">{exp.date}</td>
                    <td className="px-8 py-6 text-right font-black text-slate-900">{exp.amount}</td>
                    <td className="px-8 py-6">
                      <div className={`mx-auto w-fit px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider
                        ${exp.status === 'Settled' ? 'bg-emerald-100 text-emerald-700' : 
                          exp.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-rose-100 text-rose-700'}`}>
                        {exp.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;