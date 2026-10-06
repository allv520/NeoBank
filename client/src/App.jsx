import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Header';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Security from './pages/Security';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Cards from './pages/Cards';
import Transactions from './pages/Transactions';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import AdminTransactions from './pages/AdminTransactions';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminCredits from './pages/AdminCredits';
import AdminCreditDetail from './pages/AdminCreditDetail';
import CreditPage from './pages/CreditPage';
import PageTransition from './components/PageTransition';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/security" element={<PageTransition><Security /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/cards" element={<PageTransition><Cards /></PageTransition>} />
        <Route path="/transactions" element={<PageTransition><Transactions /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
        <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/transactions" element={<PageTransition><AdminTransactions /></PageTransition>} />
        <Route path="/admin/users/:userId" element={<PageTransition><AdminUserDetail /></PageTransition>} />
        <Route path="/admin/credits" element={<PageTransition><AdminCredits /></PageTransition>} />
        <Route path="/admin/credits/:id" element={<PageTransition><AdminCreditDetail /></PageTransition>} />
        <Route path="/credit" element={<PageTransition><CreditPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;