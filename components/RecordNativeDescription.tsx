
import React, { useState, useRef } from 'react';
import { useProductContent } from '../context/ProductContentContext';

const RecordNativeDescription: React.FC = () => {
    const { productContent, updateProductContent } = useProductContent();
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    updateProductContent({ nativeAudio: reader.result as string });
                };
                reader.readAsDataURL(audioBlob);
                setIsRecording(false);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300">Record Description (Native Language)</label>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 glass-card">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#7c4dff] hover:scale-110 shadow-lg shadow-[#7c4dff]/20'}`}
                >
                    {isRecording ? '⏹️' : '🎙️'}
                </button>
                <div className="flex-1">
                    {isRecording ? (
                        <div className="flex flex-col">
                            <span className="text-xs text-red-500 font-bold animate-pulse uppercase tracking-widest">Recording...</span>
                            <span className="text-[10px] text-gray-500">Speaking in your native language</span>
                        </div>
                    ) : productContent.nativeAudio ? (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-[#00e5ff] font-bold uppercase tracking-widest">Recording Captured</span>
                            <audio controls src={productContent.nativeAudio} className="h-8 max-w-full" />
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Ready to Record</span>
                            <span className="text-[10px] text-gray-500">Capture voice details instantly</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordNativeDescription;
