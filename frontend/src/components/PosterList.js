import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Search, XCircle } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_FASTAPI_BASE_URL || "http://localhost:8000/wormcat3";

// Key for localStorage
const COLLAPSED_SESSIONS_KEY = 'posterList_collapsedSessions';

// --- Helper Components for Cleaner UI ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{message}</span>
    </div>
);

const EmptyState = ({ message }) => (
    <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
        <XCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Results Found</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
);


const PosterList = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Initialize collapsed sessions from localStorage
    const [collapsedSessions, setCollapsedSessions] = useState(() => {
        try {
            const saved = localStorage.getItem(COLLAPSED_SESSIONS_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Error loading collapsed sessions from localStorage:', error);
            return {};
        }
    });

    // Save collapsed sessions to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(COLLAPSED_SESSIONS_KEY, JSON.stringify(collapsedSessions));
        } catch (error) {
            console.warn('Error saving collapsed sessions to localStorage:', error);
        }
    }, [collapsedSessions]);

    // Fetch data from API
    useEffect(() => {
        axios.get(`${BASE_URL}/api/posters`)
            .then(response => {
                setPosters(response.data);
            })
            .catch(error => {
                console.error('Error fetching posters:', error);
                setError('Failed to fetch poster data. Please try again later.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Memoize the filtered and grouped posters for performance
    const filteredAndGroupedPosters = useMemo(() => {
        const filtered = posters.filter(poster => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                poster.Poster_Title.toLowerCase().includes(searchTermLower) ||
                poster.Name.toLowerCase().includes(searchTermLower) ||
                poster.Affiliation.toLowerCase().includes(searchTermLower)
            );
        });

        return filtered.reduce((acc, poster) => {
            if (!acc[poster.Session]) {
                acc[poster.Session] = [];
            }
            acc[poster.Session].push(poster);
            return acc;
        }, {});
    }, [posters, searchTerm]);
    
    // Sort sessions chronologically
    const sessionOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const sortedSessions = sessionOrder.filter(session => filteredAndGroupedPosters[session]);

    const toggleSession = (session) => {
        setCollapsedSessions(prev => ({
            ...prev,
            [session]: !prev[session]
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPositionLabel = (position) => {
        switch (position) {
            case 'GS': return 'Graduate Student';
            case 'PD': return 'Postdoc';
            case 'PI': return 'Principal Investigator';
            default: return position;
        }
    };

    const getPositionClass = (position) => {
        switch (position) {
            case 'GS': return 'bg-green-100 text-green-800';
            case 'PD': return 'bg-blue-100 text-blue-800';
            case 'PI': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    // --- Render Logic ---

    if (loading) {
        return <div className="container mx-auto p-4"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="container mx-auto p-4"><ErrorMessage message={error} /></div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Poster Sessions</h1>
                <p className="mt-1 text-lg text-gray-600">Browse and search for posters presented at the conference.</p>
            </header>
            
            {/* --- Enhanced Search Input --- */}
            <div className="mb-6 sticky top-0 z-10 py-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by title, author, or affiliation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white/70 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {sortedSessions.length > 0 ? (
                    sortedSessions.map(session => {
                        const sessionPosters = filteredAndGroupedPosters[session];
                        // Default to expanded if a search is active, otherwise use stored preference
                        const isCollapsed = searchTerm ? false : collapsedSessions[session] !== false;
                        const posterCount = sessionPosters.length;
                        const sampleDate = sessionPosters[0]?.Date;

                        return (
                            <div key={session} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                <div
                                    className="bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                    onClick={() => toggleSession(session)}
                                >
                                    <div className="flex items-center space-x-3">
                                        {isCollapsed ? <ChevronRight className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">{session} Session</h2>
                                            {sampleDate && <p className="text-sm text-gray-600">{formatDate(sampleDate)}</p>}
                                        </div>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                        {posterCount} poster{posterCount !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {!isCollapsed && (
                                    <div className="p-4 md:p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {sessionPosters.map(poster => (
                                                <Link
                                                    to={`/judging/${poster.Poster_Title}`}
                                                    key={poster.Poster_Id}
                                                    className="block group"
                                                >
                                                    <div className="bg-white p-5 rounded-lg border border-gray-200 h-full flex flex-col group-hover:border-blue-400 group-hover:shadow-lg transition-all duration-300">
                                                        <h3 className="text-lg font-bold mb-3 text-gray-900 leading-tight">
                                                            {poster.Poster_Title}
                                                        </h3>
                                                        <div className="space-y-2 text-sm text-gray-600 mt-auto">
                                                            <p><span className="font-semibold text-gray-800">Poster #:</span> {poster.Poster_Board}</p>
                                                            <p><span className="font-semibold text-gray-800">Author:</span> {poster.Name}</p>
                                                            <p><span className="font-semibold text-gray-800">Affiliation:</span> {poster.Affiliation}</p>
                                                            <div className="pt-3">
                                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPositionClass(poster.Position)}`}>
                                                                    {getPositionLabel(poster.Position)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <EmptyState message={posters.length > 0 ? "Your search didn't match any posters." : "There are no posters to display at this time."} />
                )}
            </div>
        </div>
    );
};

export default PosterList;