import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const PORT = process.env.REACT_APP_PORT || 8000;
const BASE_URL = process.env.REACT_APP_FASTAPI_BASE_URL || "http://localhost"

const PosterList = () => {
    const [posters, setPosters] = useState([]);
    const [collapsedSessions, setCollapsedSessions] = useState({
        Monday: true,
        Tuesday: true,
        Wednesday: true,
        Thursday: true
    });

    useEffect(() => {
        axios.get(`${BASE_URL}:${PORT}/api/posters`)
            .then(response => {
                setPosters(response.data);
            })
            .catch(error => {
                console.error('Error fetching posters:', error);
            });
    }, []);

    // Group posters by session
    const groupedPosters = posters.reduce((acc, poster) => {
        if (!acc[poster.Session]) {
            acc[poster.Session] = [];
        }
        acc[poster.Session].push(poster);
        return acc;
    }, {});

    // Sort sessions in chronological order
    const sessionOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const sortedSessions = sessionOrder.filter(session => groupedPosters[session]);

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Poster Sessions</h1>
            
            <div className="space-y-4">
                {sortedSessions.map(session => {
                    const sessionPosters = groupedPosters[session];
                    const isCollapsed = collapsedSessions[session];
                    const posterCount = sessionPosters.length;
                    const sampleDate = sessionPosters[0]?.Date;

                    return (
                        <div key={session} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            {/* Session Header */}
                            <div 
                                className="bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 transition-colors duration-200 flex items-center justify-between"
                                onClick={() => toggleSession(session)}
                            >
                                <div className="flex items-center space-x-3">
                                    {isCollapsed ? (
                                        <ChevronRight className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                    )}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{session} Session</h2>
                                        {sampleDate && (
                                            <p className="text-sm text-gray-600">{formatDate(sampleDate)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {posterCount} poster{posterCount !== 1 ? 's' : ''}
                                </div>
                            </div>

                            {/* Session Content */}
                            {!isCollapsed && (
                                <div className="p-4 bg-white">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {sessionPosters.map(poster => (
                                            <Link 
                                                to={`/judging/${poster.Poster_Title}`} 
                                                key={poster.Poster_Id}
                                                className="block"
                                            >
                                                <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                                                    <h3 className="text-lg font-semibold mb-3 text-gray-800 leading-tight">
                                                        {poster.Poster_Title}
                                                    </h3>
                                                    
                                                    <div className="space-y-2 text-sm">
                                                        <p className="text-gray-700">
                                                            <span className="font-medium">Author:</span> {poster.Name}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-medium">Affiliation:</span> {poster.Affiliation}
                                                        </p>
                                                        <div className="flex items-center justify-between pt-2">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                poster.Position === 'GS' ? 'bg-green-100 text-green-800' :
                                                                poster.Position === 'PD' ? 'bg-blue-100 text-blue-800' :
                                                                poster.Position === 'PI' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {poster.Position === 'GS' ? 'Graduate Student' :
                                                                 poster.Position === 'PD' ? 'Postdoc' :
                                                                 poster.Position === 'PI' ? 'Principal Investigator' :
                                                                 poster.Position}
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
                })}
            </div>


        </div>
    );
};

export default PosterList;