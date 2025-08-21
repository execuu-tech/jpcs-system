import { apiGet } from "@/lib/api";

export default async function Members() {
    const members = await apiGet("/members/");
    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[40vh] bg-black text-white flex flex-col justify-center items-center overflow-hidden">
                <img
                    src="/JPCS-COVER.png"
                    alt="JPCS Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay Content */}
                <div className="relative z-10 bg-black/30 p-6 sm:p-10 rounded-xl text-center max-w-[90%] sm:max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        JPCS Members
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl">
                        List of all JPCS members with their details and QR codes
                    </p>
                </div>
            </section>

            {/* Members Table Section */}
            <section className="bg-white text-gray-800 px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-red-800 to-red-900 text-white">
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">#</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">Name</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">Student Number</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">Program</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">Year</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">Contact No.</th>
                                        <th className="px-4 sm:px-6 py-4 text-left font-semibold text-sm sm:text-base">QR Code</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {members.map((m: any, index: number) => (
                                        <tr
                                            key={m.id}
                                            className="border-b border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                        >
                                            <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm sm:text-base">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-800 text-sm sm:text-base">
                                                <div className="font-medium">
                                                    {m.lastName}, {m.firstName} {m.middleName}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                                                <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm font-mono">
                                                    {m.studentNumber}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                                                <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm font-mono">
                                                    {m.program || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                                                <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm font-mono">
                                                    {m.yearLevel || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-600 text-sm sm:text-base">
                                                <span className="bg-gray-100 px-2 py-1 rounded-md text-xs sm:text-sm font-mono">
                                                    {m.contactNumber || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                {m.qr_code ? (
                                                    <div className="flex justify-center">
                                                        <img
                                                            src={m.qr_code}
                                                            alt="QR Code"
                                                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg shadow-md border border-gray-200"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic text-xs sm:text-sm">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
