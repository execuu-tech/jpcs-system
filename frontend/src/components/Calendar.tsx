"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { CalendarEvent, getEventsForDate, getUpcomingEvents, getEventsByMonth } from '@/src/data/events';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Get events for current month
    const monthEvents = getEventsByMonth(currentYear, currentMonth);
    const upcomingEvents = getUpcomingEvents(5);

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    // Generate calendar days
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
        setSelectedDate(null);
    };

    const getEventTypeColor = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'deadline': return 'bg-red-500';
            case 'reminder': return 'bg-yellow-500';
            case 'activity': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getEventTypeIcon = (type: CalendarEvent['type']) => {
        switch (type) {
            case 'deadline': return '🔴';
            case 'reminder': return '🟡';
            case 'activity': return '🟢';
            default: return '⚪';
        }
    };

    const getPriorityColor = (priority: CalendarEvent['priority']) => {
        switch (priority) {
            case 'high': return 'border-red-500 bg-red-50';
            case 'medium': return 'border-yellow-500 bg-yellow-50';
            case 'low': return 'border-green-500 bg-green-50';
            default: return 'border-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6" />
                            JPCS - CSPC Chapter Calendar
                        </h3>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-lg font-semibold flex-1 text-center sm:min-w-[200px]">
                                {MONTHS[currentMonth]} {currentYear}
                            </span>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Next month"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map(day => (
                            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            if (!day) {
                                return <div key={index} className="p-2 h-12"></div>;
                            }

                            const date = new Date(currentYear, currentMonth, day);
                            const dayEvents = getEventsForDate(date);
                            const isToday = date.toDateString() === today.toDateString();
                            const isSelected = selectedDate?.toDateString() === date.toDateString();

                            return (
                                <button
                                    key={index} // <-- FIXED: use index instead of day
                                    onClick={() => setSelectedDate(date)}
                                    className={`
                    p-2 h-12 text-sm rounded-lg transition-colors relative
                    ${isToday ? 'bg-blue-100 text-blue-800 font-bold' : ''}
                    ${isSelected ? 'bg-blue-200 text-blue-900' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
                  `}
                                >
                                    <span>{day}</span>
                                    {dayEvents.length > 0 && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                            {dayEvents.slice(0, 3).map((event, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                                                />
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selectedDate && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Events for {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h4>
                            {getEventsForDate(selectedDate).length > 0 ? (
                                <div className="space-y-2">
                                    {getEventsForDate(selectedDate).map(event => (
                                        <div
                                            key={event.id}
                                            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(event.priority)}`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                                                <div>
                                                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                                                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                        <span className="capitalize">{event.type}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{event.priority} priority</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{event.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:w-80">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Upcoming Events
                        </h4>
                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`p-3 rounded-lg border-l-4 bg-white ${getPriorityColor(event.priority)}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className="text-sm">{getEventTypeIcon(event.type)}</span>
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900 text-sm">{event.title}</h5>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {event.date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {event.priority === 'high' && (
                                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                                    )}
                                                    <span className="text-xs text-gray-500 capitalize">
                                                        {event.priority} priority
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No upcoming events.</p>
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-3 text-sm">Event Types</h5>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <span>🔴</span>
                                <span className="text-gray-700">Deadlines</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🟡</span>
                                <span className="text-gray-700">Reminders</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>🟢</span>
                                <span className="text-gray-700">Activities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
