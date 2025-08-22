"use client";
import Link from "next/link";

export default function HomeContent() {
    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[80vh] bg-black text-white flex flex-col justify-center items-center overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://res.cloudinary.com/dmkbde9r8/video/upload/v1755411046/JPCS-PROMO_sh7j7g.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Content */}
                <div className="relative z-10 bg-black/35 p-6 sm:p-10 rounded-xl text-center max-w-[90%] sm:max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">Welcome!</h1>
                    <p className="text-base sm:text-lg md:text-xl">
                        Everything you need to get started is right here.
                    </p>
                </div>

                {/* Scroll Down Arrow */}
                <a
                    href="#sections"
                    className="absolute bottom-12 sm:bottom-8 text-white bg-black/30 text-2xl sm:text-3xl p-3 sm:p-4 rounded-full border-2 border-black/30 animate-bounce z-10"
                >
                    ↓
                </a>
            </section>

            {/* Sections Card Grid */}
            <section id="sections" className="bg-white text-gray-800 px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-10">Explore the Org</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link href="/members" className="block p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-100 to-blue-200 hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2">🤵 Members</h3>
                            <p>List of all Junior Philippine Computer Society - CSPC Chapter members</p>
                        </Link>
                        <Link href="/attendance" className="block p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-100 to-green-200 hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2">📋 Attendance</h3>
                            <p>List of all events and activities with attendance</p>
                        </Link>
                        <Link href="/about" className="block p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-100 to-purple-200 hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold mb-2">📌 About</h3>
                            <p>Learn about the Junior Philippine Computer Society - CSPC Chapter and find contacts.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
