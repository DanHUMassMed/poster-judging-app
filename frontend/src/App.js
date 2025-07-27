import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JudgingForm from './components/JudgingForm';
import Results from './components/Results';
import PosterList from './components/PosterList';

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="App bg-gray-100 min-h-screen">
        <nav className="bg-white p-4 shadow-md">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-blue-500 hover:underline">Poster List</Link>
            </li>
            <li>
              <Link to="/judging" className="text-blue-500 hover:underline">Judging Form</Link>
            </li>
            <li>
              <Link to="/results" className="text-blue-500 hover:underline">Results</Link>
            </li>
          </ul>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/" element={<PosterList />} />
            <Route path="/judging/:posterId" element={<JudgingForm />} />
            <Route path="/judging" element={<JudgingForm />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;