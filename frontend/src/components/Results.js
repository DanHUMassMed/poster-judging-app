// frontend/src/components/Results.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const BASE_URL = process.env.REACT_APP_FASTAPI_BASE_URL || "http://localhost:8000/wormcat3";

const Results = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [scores, setScores] = useState([]);
    const [collapsedSections, setCollapsedSections] = useState({});
    const [sortStates, setSortStates] = useState({}); // {date: {column: 'Poster_Title', direction: 'asc'}}

    const toggleSection = (date) => {
        setCollapsedSections(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const handleSort = (date, column) => {
        setSortStates(prev => {
            const currentSort = prev[date];
            const newDirection = currentSort?.column === column && currentSort?.direction === 'asc' ? 'desc' : 'asc';
            
            return {
                ...prev,
                [date]: { column, direction: newDirection }
            };
        });
    };

    const getSortedRecords = (records, date) => {
        const sortState = sortStates[date];
        if (!sortState || !sortState.column) return records;

        return [...records].sort((a, b) => {
            const aValue = a[sortState.column] || '';
            const bValue = b[sortState.column] || '';
            
            const comparison = aValue.toString().localeCompare(bValue.toString());
            return sortState.direction === 'asc' ? comparison : -comparison;
        });
    };

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
            axios.get(`${BASE_URL}/api/scores`)
                .then(response => {
                    setScores(response.data);
                    
                    // Set initial collapsed state - only today's date expanded
                    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                    const dateGroups = response.data.reduce((acc, record) => {
                        if (record.Timestamp) {
                            const date = record.Timestamp.split(' ')[0];
                            acc[date] = true; // Start with all collapsed
                        }
                        return acc;
                    }, {});
                    
                    // Expand only today's date
                    if (dateGroups[today] !== undefined) {
                        dateGroups[today] = false; // false means expanded
                    }
                    
                    setCollapsedSections(dateGroups);
                })
                .catch(error => console.error('Error fetching scores:', error));
        }
    }, [isAuthenticated]);

const downloadCSV = () => {
    const headers = Object.keys(scores[0]);
    const csvContent = [
        headers.join(','),
        ...scores.map(row => headers.map(header => {
            let cell = row[header];
            if (typeof cell === 'string') {
                // Escape internal double quotes
                cell = cell.replace(/"/g, '""');
                // Quote if it's Poster_Title or Comments, or if it contains commas/newlines
                if (header === 'Poster_Title' || header === 'Comments' || /[",\n]/.test(cell)) {
                    cell = `"${cell}"`;
                }
            }
            return cell;
        }).join(','))
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
            
            <button onClick={downloadCSV} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-6">Download CSV</button>
            
            {/* Group and display records by date */}
            {(() => {
                // Group records by date
                const dateGroups = scores.reduce((acc, record) => {
                    if (record.Timestamp) {
                        const date = record.Timestamp.split(' ')[0]; // Extract date part
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(record);
                    }
                    return acc;
                }, {});
                
                // Sort dates in descending order (most recent first)
                const sortedDates = Object.keys(dateGroups).sort((a, b) => new Date(b) - new Date(a));
                
                return sortedDates.map(date => {
                    const recordsForDate = dateGroups[date];
                    const isCollapsed = collapsedSections[date];
                    
                    return (
                        <div key={date} className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Date header with toggle */}
                            <div 
                                className="bg-blue-100 p-4 cursor-pointer hover:bg-blue-200 transition-colors flex justify-between items-center"
                                onClick={() => toggleSection(date)}
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-800">{date}</h2>
                                    <p className="text-blue-600">{recordsForDate.length} records</p>
                                </div>
                                <div className="text-blue-800 text-xl">
                                    {isCollapsed ? '▶' : '▼'}
                                </div>
                            </div>
                            
                            {/* Collapsible table */}
                            {!isCollapsed && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                {recordsForDate.length > 0 && Object.keys(recordsForDate[0]).map(key => {
                                                    const isSortable = key === 'Poster_Title' || key === 'Judge';
                                                    const currentSort = sortStates[date];
                                                    const isActiveSort = currentSort?.column === key;
                                                    
                                                    return (
                                                        <th 
                                                            key={key} 
                                                            className={`p-2 border text-left ${isSortable ? 'cursor-pointer hover:bg-gray-300 select-none' : ''}`}
                                                            onClick={isSortable ? () => handleSort(date, key) : undefined}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <span>{key}</span>
                                                                {isSortable && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {isActiveSort ? (
                                                                            currentSort.direction === 'asc' ? '↑' : '↓'
                                                                        ) : '↕'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getSortedRecords(recordsForDate, date).map((record, index) => (
                                                <tr key={index} className="border-t hover:bg-gray-50">
                                                    {Object.values(record).map((value, i) => 
                                                        <td key={i} className="p-2 border">{value}</td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                });
            })()}
        </div>
    );
};

export default Results;