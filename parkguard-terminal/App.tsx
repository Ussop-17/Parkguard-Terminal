
import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import { User } from './types';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', role: 'admin', location: 'Main Terminal' }
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup'>('home');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleSignUp = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    setCurrentPage('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: 'home' | 'login' | 'signup') => {
    setCurrentPage(page);
  };

  if (currentUser) {
    return (
      <div className="font-sans antialiased text-slate-900 bg-white selection:bg-slate-900 selection:text-white">
        <Dashboard user={currentUser} onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-slate-900 bg-white selection:bg-slate-900 selection:text-white">
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login users={users} onLogin={handleLogin} onNavigate={handleNavigate} />}
      {currentPage === 'signup' && <SignUp onSignUp={handleSignUp} onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
