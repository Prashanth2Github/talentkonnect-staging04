import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GigList from './components/GigList';
import Wallet from './pages/Wallet';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GigList />} />
        <Route path="/wallet" element={<Wallet />} />
      </Routes>
    </Router>
  );
}

export default App;
