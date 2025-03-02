import { useState, useEffect, useRef } from "react";

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<BlobPart[]>([]);

    useEffect(() => {
        const requestMicrophonePermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // ✅ 使用 `audio/webm`，瀏覽器支援，後端再轉換
                mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

                mediaRecorder.current.ondataavailable = (event) => {
                    audioChunks.current.push(event.data);
                };

                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" }); // ✅ 確保輸出為 WEBM
                    setAudioBlob(audioBlob);
                    audioChunks.current = [];
                };
            } catch (error) {
                console.error("❌ 麥克風存取失敗", error);
            }
        };

        requestMicrophonePermission();
    }, []);

    const startRecording = () => {
        if (mediaRecorder.current) {
            audioChunks.current = [];
            mediaRecorder.current.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    return { isRecording, startRecording, stopRecording, audioBlob };
};

export default useAudioRecorder;
 