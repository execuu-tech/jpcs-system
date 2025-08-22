"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

export default function MembersPage() {
    const router = useRouter();

    // ---------------- Auth ----------------
    const [authenticated, setAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // ---------------- Members State ----------------
    const [members, setMembers] = useState<any[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
    const [editingMember, setEditingMember] = useState<any | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [deletingMember, setDeletingMember] = useState<any | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventsModalOpen, setEventsModalOpen] = useState(false);
    const [memberEvents, setMemberEvents] = useState<any[]>([]);
    const [currentMemberName, setCurrentMemberName] = useState("");
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrImage, setQrImage] = useState<string | null>(null);

    // ---------------- Filters/Search ----------------
    const [searchQuery, setSearchQuery] = useState("");
    const [filterProgram, setFilterProgram] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>("all");

    const [formData, setFormData] = useState<any>({
        studentNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        yearLevel: "",
        program: "",
        isReg: "",
        cspcEmail: "",
        contactNumber: "",
        position: "",
        foodRestriction: "",
    });

    // ---------------- Auth Check Effect ----------------
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("/api/check-auth");
                const data = await res.json();
                if (data.authenticated) {
                    setAuthenticated(true);
                } else {
                    router.replace("/login");
                    toast.error("You must be logged in to access this page", { duration: 2000 });
                }
            } catch (err) {
                console.error("Auth check failed", err);
                router.replace("/login");
                toast.error("You must be logged in to access this page", { duration: 2000 });
            } finally {
                setLoadingAuth(false);
            }
        }
        checkAuth();
    }, [router]);

    // ---------------- Fetch Members ----------------
    useEffect(() => {
        if (authenticated) {
            apiGet("/members/").then((data) => {
                setMembers(data);
                setFilteredMembers(data);
            });
        }
    }, [authenticated]);

    // ---------------- Filter/Search Effect ----------------
    useEffect(() => {
        let result = members;

        if (searchQuery.trim() !== "") {
            result = result.filter((m) =>
                `${m.lastName} ${m.firstName} ${m.middleName || ""} ${m.studentNumber}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        }

        if (filterProgram !== "all") {
            result = result.filter((m) => m.program === filterProgram);
        }

        if (filterYear !== "all") {
            result = result.filter((m) => String(m.yearLevel) === filterYear);
        }

        setFilteredMembers(result);
    }, [searchQuery, filterProgram, filterYear, members]);

    // ---------------- Handlers ----------------
    const handleEdit = (member: any) => {
        setEditingMember(member);
        setFormData(member);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingMember) return;
        const updated = await apiPut(`/members/${editingMember.id}`, formData);
        setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        setIsEditModalOpen(false);
        setEditingMember(null);
    };

    const viewMemberAttendance = async (memberId: number) => {
        try {
            const member = members.find((m: any) => m.id === memberId);
            setCurrentMemberName(`${member?.lastName}, ${member?.firstName}`);
            const events = await apiGet(`/attendance/member/${memberId}/events`);

            const sectionOrder: Record<string, number> = { morning: 0, afternoon: 1, night: 2 };
            events.sort((a: any, b: any) => {
                const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
                if (dateDiff !== 0) return dateDiff;
                return (sectionOrder[a.section] ?? 3) - (sectionOrder[b.section] ?? 3);
            });

            const grouped: Record<string, { name: string; date: string; sections: any[] }> = {};
            events.forEach((e: any) => {
                const key = `${e.name}-${e.date}`;
                if (!grouped[key]) grouped[key] = { name: e.name, date: e.date, sections: [] };
                grouped[key].sections.push(e);
            });

            setMemberEvents(Object.values(grouped));
            setEventsModalOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load events.");
        }
    };

    const handleDelete = async () => {
        if (!deletingMember) return;
        await apiDelete(`/members/${deletingMember.id}`);
        setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
        setIsDeleteModalOpen(false);
        setDeletingMember(null);
    };

    const programs = Array.from(new Set(members.map((m) => m.program).filter(Boolean)));
    const years = Array.from(new Set(members.map((m) => m.yearLevel).filter(Boolean)));

    // ---------------- Conditional Rendering ----------------
    if (loadingAuth) return null;
    if (!authenticated) return null;

    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[40vh] bg-black text-white flex flex-col justify-center items-center overflow-hidden">
                <img
                    src="/JPCS-COVER.png"
                    alt="JPCS Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 bg-black/30 p-6 sm:p-10 rounded-xl text-center max-w-[90%] sm:max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        JPCS Members
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl">
                        List of all JPCS members with their details and QR codes
                    </p>
                </div>
            </section>

            {/* search/filter */}
            <section className="bg-white px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
                    <Input
                        placeholder="🔍 Search by name or student number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-1/3"
                    />

                    <Select value={filterProgram} onValueChange={setFilterProgram}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter Program" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Programs</SelectItem>
                            {programs.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Filter Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            {years.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    Year {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery("");
                            setFilterProgram("all");
                            setFilterYear("all");
                        }}
                        className="w-full sm:w-auto"
                    >
                        ❌ Clear
                    </Button>
                </div>
            </section>
            {/* member list table */}
            <section className="bg-white text-gray-800 px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="hidden md:table min-w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-red-800 to-red-900 text-white">
                                        {["#", "Name", "Student Number", "Program", "Year", "Contact No.", "QR Code", "Actions"].map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredMembers.map((m, index) => (
                                        <tr key={m.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{`${m.lastName}, ${m.firstName} ${m.middleName || ""}`}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{m.studentNumber}</td>
                                            <td className="px-4 py-3">{m.program || "N/A"}</td>
                                            <td className="px-4 py-3">{m.yearLevel || "N/A"}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">{m.contactNumber || "N/A"}</td>
                                            <td className="px-4 py-3 text-center">
                                                {m.qr_code ? (
                                                    <img
                                                        src={m.qr_code}
                                                        alt="QR"
                                                        className="w-12 h-12 mx-auto cursor-pointer hover:scale-110 transition"
                                                        onClick={() => {
                                                            setQrImage(m.qr_code);
                                                            setQrModalOpen(true);
                                                        }}
                                                    />
                                                ) : "N/A"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        onClick={() => handleEdit(m)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded"
                                                    >
                                                        ✏️ Update
                                                    </Button>
                                                    <Button
                                                        onClick={() => viewMemberAttendance(m.id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded"
                                                    >
                                                        📋 View Events
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setDeletingMember(m);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
                                                    >
                                                        🗑️ Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* mobile responsive view */}
                            <div className="space-y-4 md:hidden">
                                {filteredMembers.map((m, index) => (
                                    <div
                                        key={m.id}
                                        className="bg-white rounded-xl shadow p-4 border border-gray-200"
                                    >
                                        <p className="text-xs text-gray-500 mb-1">#{index + 1}</p>
                                        <p className="font-bold text-gray-900">{`${m.lastName}, ${m.firstName} ${m.middleName || ""}`}</p>
                                        <p className="text-sm text-gray-700">🎓 {m.program} — Year {m.yearLevel || "N/A"}</p>
                                        <p className="text-sm text-gray-700">🆔 {m.studentNumber}</p>
                                        <p className="text-sm text-gray-700">📞 {m.contactNumber || "N/A"}</p>

                                        <div className="mt-2">
                                            {m.qr_code ? (
                                                <img
                                                    src={m.qr_code}
                                                    alt="QR"
                                                    className="w-20 h-20 cursor-pointer hover:scale-105 transition"
                                                    onClick={() => {
                                                        setQrImage(m.qr_code);
                                                        setQrModalOpen(true);
                                                    }}
                                                />
                                            ) : (
                                                <span className="text-gray-500 text-sm">No QR</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <Button
                                                onClick={() => handleEdit(m)}
                                                className="bg-green-500 hover:bg-green-600 text-white flex-1 text-xs rounded"
                                            >
                                                ✏️ Update
                                            </Button>
                                            <Button
                                                onClick={() => viewMemberAttendance(m.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white flex-1 text-xs rounded"
                                            >
                                                📋 Events
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setDeletingMember(m);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="bg-red-500 hover:bg-red-600 text-white flex-1 text-xs rounded"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>QR Code</DialogTitle>
                    </DialogHeader>
                    {qrImage && (
                        <img src={qrImage} alt="QR Code" className="w-full h-auto mx-auto" />
                    )}
                </DialogContent>
            </Dialog>

            {/* events modal */}
            {eventsModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-11/12 max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Events Attended: {currentMemberName}</h2>


                        {memberEvents.length ? (
                            <div className="max-h-80 overflow-y-auto space-y-4">
                                {memberEvents.map((event) => (
                                    <div key={`${event.name}-${event.date}`} className="border-b pb-2">
                                        <p className="font-semibold">{event.name} ({new Date(event.date).toLocaleDateString()})</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {event.sections.map((s) => (
                                                <li key={`${s.id}-${s.section}`}>
                                                    {s.section.charAt(0).toUpperCase() + s.section.slice(1)}: {s.status}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">No events attended.</p>
                        )}
                        <button
                            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
                            onClick={() => setEventsModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* edit modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <Input
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                        <Input
                            placeholder="Student Number"
                            value={formData.studentNumber}
                            onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                        />
                        <Input
                            placeholder="Program"
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdate} className="bg-yellow-500 text-white">Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* delete modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Member</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete <b>{deletingMember?.firstName} {deletingMember?.lastName}</b>?</p>
                    <DialogFooter>
                        <Button onClick={handleDelete} className="bg-red-600 text-white">Confirm Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
