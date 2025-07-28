import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JudgingForm from './components/JudgingForm';
import Results from './components/Results';
import PosterList from './components/PosterList';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Router future={{ v7_startTransition: true }}>
      <div className="App bg-gray-100 min-h-screen flex flex-col">
        <nav className="bg-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <img 
                src="grc_logo.png" 
                alt="GRC Logo" 
                className="h-8 w-auto"
              />
              <h1 className="text-lg font-semibold text-gray-800 text-center">
                Molecular and Cellular<br/> Biology of Lipids<br />
                <span className="text-sm font-normal text-gray-600">Gordon Research Conference</span>
              </h1>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <Link to="/" className="text-blue-500 hover:underline font-medium">
                  Poster List
                </Link>        
              </li>
              <li>
                <Link to="/judging" className="text-blue-500 hover:underline font-medium">
                  Judging Form
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-blue-500 hover:underline font-medium">
                  Results
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden mt-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="space-y-2 border-t pt-4">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 px-4 text-blue-500 hover:bg-blue-50 rounded-md font-medium"
                  onClick={closeMenu}
                >
                  Poster List
                </Link>
              </li>
              <li>
                <Link 
                  to="/judging" 
                  className="block py-2 px-4 text-blue-500 hover:bg-blue-50 rounded-md font-medium"
                  onClick={closeMenu}
                >
                  Judging Form
                </Link>
              </li>
              <li>
                <Link 
                  to="/results" 
                  className="block py-2 px-4 text-blue-500 hover:bg-blue-50 rounded-md font-medium"
                  onClick={closeMenu}
                >
                  Results
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="p-4 flex-grow">
          <Routes>
            <Route path="/" element={<PosterList />} />
            <Route path="/judging/:posterId" element={<JudgingForm />} />
            <Route path="/judging" element={<JudgingForm />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>

        <footer className="bg-black p-4">
          <div className="text-center text-white text-sm">
            Gordon Research Conference
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;