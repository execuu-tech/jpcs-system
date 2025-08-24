export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "deadline" | "reminder" | "activity";
  priority: "high" | "medium" | "low";
  category: "academic" | "financial" | "ptp" | "guild" | "general";
}

// Sample events - YOU CAN EDIT THESE!
export const sampleEvents: CalendarEvent[] = [
  // Academic Deadlines
  {
    id: "1",
    title: "Example Deadline Submission",
    description: "Example description",
    date: new Date(2025, 0, 31), // January 31, 2025
    type: "deadline",
    priority: "high",
    category: "academic",
  },
  {
    id: "2",
    title: "Example Reminder",
    description: "Example description.",
    date: new Date(2025, 5, 30), // June 30, 2025
    type: "deadline",
    priority: "high",
    category: "academic",
  },
  {
    id: "3",
    title: "Example Reminder",
    description: "Example description.",
    date: new Date(2025, 7, 31), // August 31, 2025
    type: "reminder",
    priority: "medium",
    category: "academic",
  },

  {
    id: "4",
    title: "Example Deadline",
    description: "Example deadline desc.",
    date: new Date(2025, 7, 15), // August 15, 2025
    type: "deadline",
    priority: "high",
    category: "ptp",
  },

  // Yearly Reports
  {
    id: "5",
    title: "Example Activity",
    description: "Example activity description.",
    date: new Date(2025, 11, 30), // December 30, 2025
    type: "activity",
    priority: "low",
    category: "academic",
  },
];

// Helper functions
export function getEventsForDate(date: Date): CalendarEvent[] {
  return sampleEvents.filter(
    (event) =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  );
}

export function getUpcomingEvents(limit: number = 5): CalendarEvent[] {
  const today = new Date();
  return sampleEvents
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
}

export function getEventsByMonth(year: number, month: number): CalendarEvent[] {
  return sampleEvents.filter(
    (event) =>
      event.date.getFullYear() === year && event.date.getMonth() === month,
  );
}
