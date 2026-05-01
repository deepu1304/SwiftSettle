import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <h2 className="text-center text-3xl font-extrabold text-slate-900">
          SwiftSettle
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to manage your business expenses
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input type="email" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
