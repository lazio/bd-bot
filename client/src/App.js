import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [birthdays, setBirthdays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBirthdays();
    }, []);

    const fetchBirthdays = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/birthdays');
            const data = await response.json();
            setBirthdays(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching birthdays:', error);
            setError('Failed to fetch birthdays');
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDaysUntilBirthday = (birthdayDate) => {
        const today = new Date();
        const birthday = new Date(birthdayDate);
        const diffTime = birthday - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const sendGreeting = async (person) => {
        try {
            await fetch('http://localhost:3001/api/send-greeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ person }),
            });
            alert('Greeting sent successfully!');
        } catch (error) {
            alert('Failed to send greeting');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="App">
            <h1>Upcoming Birthday Greetings</h1>
            <div className="birthday-list">
                {birthdays.length === 0 ? (
                    <p>No birthdays in the next 30 days!</p>
                ) : (
                    birthdays.map((birthday) => {
                        const daysUntil = getDaysUntilBirthday(birthday.start.date);
                        return (
                            <div key={birthday.id} className="birthday-card">
                                <h3>{birthday.summary}</h3>
                                <p className="date">{formatDate(birthday.start.date)}</p>
                                <p className="days-until">
                                    {daysUntil === 0 
                                        ? "Today!" 
                                        : daysUntil === 1 
                                            ? "Tomorrow!" 
                                            : `In ${daysUntil} days`}
                                </p>
                                <button onClick={() => sendGreeting(birthday)}>
                                    Send AI Greeting
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default App; 