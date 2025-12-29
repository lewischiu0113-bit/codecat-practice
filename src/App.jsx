import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExamList from './components/ExamList';
import ExamInterface from './components/ExamInterface';
import Results from './components/Results';
import History from './components/History';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exam/:id" element={<ExamInterface />} />
            <Route path="/exam/:id/results" element={<Results />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
