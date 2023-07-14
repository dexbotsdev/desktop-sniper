/* eslint-disable prettier/prettier */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SniperPage from './pages/sniper';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SniperPage />} />
      </Routes>
    </Router>
  );
}
