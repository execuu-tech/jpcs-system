"use client";
import React, { useEffect, useState } from "react";
import QRScanner from "@/src/components/QRScanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

interface Event {
    id: number;
    name: string;
    date: string;
    has_morning?: boolean;
    has_afternoon?: boolean;
    has_night?: boolean;
}

interface Attendance {
    id: number;
    member: any;
    status: string;
    timestamp: string;
}

export default function AttendancePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [attendees, setAttendees] = useState<Attendance[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<"morning" | "afternoon" | "night" | null>(null);
    const [scanning, setScanning] = useState(false);


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [tempScanEvent, setTempScanEvent] = useState<Event | null>(null);

    const eventName = `Event name: ${tempScanEvent?.name}`;

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        has_morning: false,
        has_afternoon: false,
        has_night: false,
    });
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

    // Load events
    useEffect(() => {
        apiGet("/attendance/events")
            .then(setEvents)
            .catch((err) => console.error("Failed to load events:", err));
    }, []);

    const [showAttendees, setShowAttendees] = useState(false);

    const toggleAttendees = (eventId: number) => {
        if (selectedEvent === eventId && showAttendees) {
            setShowAttendees(false);
            setSelectedEvent(null);
            setSelectedSection(null);
            setAttendees([]);
        } else {
            setSelectedEvent(eventId);
            setShowAttendees(true);
            setSelectedSection(null);
        }
    };

    const fetchAttendance = (eventId: number, section?: "morning" | "afternoon" | "night") => {
        setSelectedSection(section ?? null);
        apiGet(`/attendance/attendance/list?event_id=${eventId}&section=${section}`)
            .then(setAttendees)
            .catch((err) => console.error("Failed to load attendance:", err));
    };

    const handleScan = async (qr_token: string) => {
        if (!selectedEvent || !selectedSection) {
            toast.error("Please select a section first");
            return;
        }
        try {
            await apiPost("/attendance/attendance/scan", {
                qr_token,
                event_id: selectedEvent,
                section: selectedSection,
            });
            fetchAttendance(selectedEvent, selectedSection);
            toast.success(`Attendance marked for ${selectedSection}!`);
        } catch (err: any) {
            if (err.status === 400 && err.data?.detail === "Already scanned") {
                toast("Member is already marked present for this section!", { icon: "⚠️" });
            } else {
                console.error(err);
                toast.error("Failed to mark attendance.");
            }
        }
    };

    // Open section selection modal
    const openSectionModal = (event: Event) => {
        setTempScanEvent(event);
        setIsSectionModalOpen(true);
    };

    const startScan = (section: "morning" | "afternoon" | "night") => {
        if (tempScanEvent) {
            setSelectedEvent(tempScanEvent.id);
            setSelectedSection(section);
            setScanning(true);
        }
        setIsSectionModalOpen(false);
    };

    const handleAddEvent = async () => {
        if (!formData.name || !formData.date) return;
        try {
            const newEvent = await apiPost("/attendance/events", formData);
            setEvents((prev) => [...prev, newEvent]);
            setIsAddModalOpen(false);
            setFormData({ name: "", date: "", has_morning: false, has_afternoon: false, has_night: false });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add event.");
        }
    };

    const handleEditEvent = async () => {
        if (!editingEvent) return;
        try {
            const updated = await apiPut(`/attendance/events/${editingEvent.id}`, formData);
            setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
            setIsEditModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update event.");
        }
    };

    const handleDeleteEvent = async () => {
        if (!deletingEvent) return;
        try {
            await apiDelete(`/attendance/events/${deletingEvent.id}`);
            setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete event.");
        }
    };

    const currentEvent = events.find((e) => e.id === selectedEvent);

    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[40vh] bg-black text-white flex flex-col justify-center items-center overflow-hidden">
                <img src="/JPCS-COVER.png" alt="JPCS Cover" className="absolute inset-0 w-full h-full object-cover" />
                <div className="relative z-10 bg-black/30 p-6 sm:p-10 rounded-xl text-center max-w-[90%] sm:max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">Attendance Tracking</h1>
                    <p className="text-base sm:text-lg md:text-xl">Manage events, scan members, and view attendance records</p>
                </div>
            </section>

            {/* Events Table */}
            <section className="bg-white text-gray-800 px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-end mb-6">
                        <Button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition">
                            ➕ Add Event
                        </Button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-red-800 to-red-900 text-white">
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold">Event Name</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold">Date</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {events.map((event) => (
                                        <tr key={event.id} className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{event.name}</td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-600">{format(new Date(event.date), "MM/dd/yyyy")}</td>
                                            <td className="px-4 sm:px-6 py-4 space-x-2">
                                                <Button
                                                    onClick={() => toggleAttendees(event.id)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                                >
                                                    {selectedEvent === event.id && showAttendees ? "Hide Attendees" : "View Attendees"}
                                                </Button>
                                                <Button
                                                    onClick={() => openSectionModal(event)}
                                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                                                >
                                                    Scan QR
                                                </Button>
                                                <Button
                                                    onClick={() => { setEditingEvent(event); setFormData({ name: event.name, date: event.date }); setIsEditModalOpen(true); }}
                                                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                                                >
                                                    ✏️ Edit
                                                </Button>
                                                <Button
                                                    onClick={() => { setDeletingEvent(event); setIsDeleteModalOpen(true); }}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                                                >
                                                    🗑️ Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Attendees Section */}
                    {selectedEvent && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-2">Attendees</h2>
                            <div className="flex gap-2 mb-2">
                                {currentEvent?.has_morning && (
                                    <Button
                                        variant={selectedSection === 'morning' ? 'default' : 'outline'}
                                        onClick={() => fetchAttendance(selectedEvent, 'morning')}
                                    >
                                        Morning
                                    </Button>
                                )}
                                {currentEvent?.has_afternoon && (
                                    <Button
                                        variant={selectedSection === 'afternoon' ? 'default' : 'outline'}
                                        onClick={() => fetchAttendance(selectedEvent, 'afternoon')}
                                    >
                                        Afternoon
                                    </Button>
                                )}
                                {currentEvent?.has_night && (
                                    <Button
                                        variant={selectedSection === 'night' ? 'default' : 'outline'}
                                        onClick={() => fetchAttendance(selectedEvent, 'night')}
                                    >
                                        Night
                                    </Button>
                                )}
                            </div>
                            {selectedSection && (
                                <p className="text-gray-700 mb-4">Viewing attendance for: <b>{selectedSection}</b> section</p>
                            )}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-red-800 to-red-900 text-white">
                                                <th className="px-4 sm:px-6 py-4 text-left font-semibold">Year</th>
                                                <th className="px-4 sm:px-6 py-4 text-left font-semibold">Program</th>
                                                <th className="px-4 sm:px-6 py-4 text-left font-semibold">Name</th>
                                                <th className="px-4 sm:px-6 py-4 text-left font-semibold">Status</th>
                                                <th className="px-4 sm:px-6 py-4 text-left font-semibold">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {attendees.map((a) => (
                                                <tr key={a.id} className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                                                    <td className="px-4 sm:px-6 py-4 text-gray-800">{a.member?.yearLevel}</td>
                                                    <td className="px-4 sm:px-6 py-4 text-gray-800">{a.member?.program}</td>
                                                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900">{a.member?.lastName}, {a.member?.firstName} {a.member?.middleName}</td>
                                                    <td className="px-4 sm:px-6 py-4 text-gray-600">{a.status}</td>
                                                    <td className="px-4 sm:px-6 py-4 text-gray-600">{format(new Date(a.timestamp), "MM/dd/yyyy hh:mm a")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* QR Scanner Overlay */}
            {scanning && tempScanEvent && selectedSection && (
                <QRScanner
                    onScan={handleScan}
                    onClose={() => setScanning(false)}
                    eventName={`Event: ${tempScanEvent?.name}`}
                    section={selectedSection}
                />
            )}

            {/* Section selection modal */}
            <Dialog open={isSectionModalOpen} onOpenChange={setIsSectionModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Section for {tempScanEvent?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-4 mt-4 justify-center">
                        {tempScanEvent?.has_morning && <Button onClick={() => startScan("morning")}>Morning</Button>}
                        {tempScanEvent?.has_afternoon && <Button onClick={() => startScan("afternoon")}>Afternoon</Button>}
                        {tempScanEvent?.has_night && <Button onClick={() => startScan("night")}>Night</Button>}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modals */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Event Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.has_morning}
                                    onChange={(e) => setFormData({ ...formData, has_morning: e.target.checked })}
                                />
                                Morning
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.has_afternoon}
                                    onChange={(e) => setFormData({ ...formData, has_afternoon: e.target.checked })}
                                />
                                Afternoon
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.has_night}
                                    onChange={(e) => setFormData({ ...formData, has_night: e.target.checked })}
                                />
                                Night
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddEvent} className="bg-purple-600 text-white"> Save </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Event Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEditEvent} className="bg-yellow-500 text-white"> Update </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Event</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete <b>{deletingEvent?.name}</b>?</p>
                    <DialogFooter>
                        <Button onClick={handleDeleteEvent} className="bg-red-600 text-white"> Confirm Delete </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
