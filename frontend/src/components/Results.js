// frontend/src/components/Results.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Results = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [scores, setScores] = useState([]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '1232') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            axios.get('http://localhost:8000/api/scores')
                .then(response => setScores(response.data))
                .catch(error => console.error('Error fetching scores:', error));
        }
    }, [isAuthenticated]);

    const downloadCSV = () => {
        const headers = Object.keys(scores[0]);
        const csvContent = [
            headers.join(','),
            ...scores.map(row => headers.map(header => row[header]).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'scores.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Results</h1>
                <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <label className="block text-gray-700">Enter Passcode</label>
                    <input type="password" value={password} onChange={handlePasswordChange} className="w-full p-2 border rounded" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">View Results</button>
                </form>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Results</h1>
            <button onClick={downloadCSV} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4">Download CSV</button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200">
                            {scores.length > 0 && Object.keys(scores[0]).map(key => <th key={key} className="p-2 border">{key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index} className="border-t">
                                {Object.values(score).map((value, i) => <td key={i} className="p-2 border">{value}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Results;
