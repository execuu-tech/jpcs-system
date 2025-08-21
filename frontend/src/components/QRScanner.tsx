"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    BrowserMultiFormatReader,
    NotFoundException,
} from "@zxing/library";

interface QRScannerProps {
    onScan: (result: string) => void;
    onClose: () => void;
    eventName?: string;
    section?: "morning" | "afternoon" | "night";
}

export default function QRScanner({ onScan, onClose, eventName, section }: QRScannerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        if (isMobile) {
            if (videoRef.current) {
                codeReader
                    .decodeFromVideoDevice(
                        { facingMode: { exact: "environment" } },
                        videoRef.current,
                        (result, err) => {
                            if (result) onScan(result.getText());
                            if (err && !(err instanceof NotFoundException)) {
                                setError("Scanning error: " + err.message);
                            }
                        }
                    )
                    .catch(() => setError("Unable to access rear camera"));
            }
        } else {
            codeReader.listVideoInputDevices().then((videoDevices) => {
                const realCameras = videoDevices.filter(
                    (d) => !/phone link|virtual|obs|snap/i.test(d.label)
                );

                const chosen =
                    realCameras.length > 0
                        ? realCameras[0].deviceId
                        : videoDevices[0]?.deviceId;

                if (chosen && videoRef.current) {
                    codeReader.decodeFromVideoDevice(
                        chosen,
                        videoRef.current,
                        (result, err) => {
                            if (result) onScan(result.getText());
                            if (err && !(err instanceof NotFoundException)) {
                                setError("Scanning error: " + err.message);
                            }
                        }
                    );
                } else {
                    setError("No camera found");
                }
            });
        }

        return () => {
            if (codeReaderRef.current) {
                codeReaderRef.current.decodeFromVideoDevice(null, videoRef.current, () => { });
            }
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        };
    }, [onScan, isMobile]);

    const handleClose = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
            {/* Event Name & Section */}
            {eventName && section && (
                <div className="mb-4 text-center text-white">
                    <h2 className="text-xl font-bold">{eventName}</h2>
                    <p className="text-lg capitalize">{section} section</p>
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full max-w-md rounded-lg border-4 border-white shadow-lg"
                autoPlay
                muted
            />

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <button
                onClick={handleClose}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
            >
                Close
            </button>
        </div>
    );
}
