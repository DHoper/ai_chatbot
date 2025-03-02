import React, { useState, useEffect, useCallback, useRef } from "react";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import { processAudioWithAI } from "@/services/api";

const App: React.FC = () => {
    const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();
    const [text, setText] = useState("");  
    const [response, setResponse] = useState("");  
    const [audioURL, setAudioURL] = useState("");  
    const [selectedMode, setSelectedMode] = useState("default");
    const [isUploading, setIsUploading] = useState(false);  // 防止重複請求
    const audioBlobRef = useRef<Blob | null>(null);  // 確保只處理新的 audioBlob

    const handleUpload = useCallback(async (audioBlob: Blob) => {
        if (!audioBlob || isUploading) {
            console.warn("⚠️ 無效的音訊 Blob 或正在處理中，取消上傳。");
            return;
        }

        setIsUploading(true);
        try {
            console.log("📤 正在上傳音頻...");

            // 🚀 發送語音至 AI Assistant API
            const { text, audioBlob: responseAudioBlob } = await processAudioWithAI(audioBlob, selectedMode);

            // ✅ 清理舊的音訊 URL，避免記憶體洩漏
            setAudioURL((prevAudioURL) => {
                if (prevAudioURL) URL.revokeObjectURL(prevAudioURL);
                return responseAudioBlob ? URL.createObjectURL(responseAudioBlob) : "";
            });

            setText(text);
            setResponse(text);

            console.log("✅ AI 回應完成");

            // 🔊 自動播放 AI 語音
            if (responseAudioBlob) {
                const audio = new Audio(URL.createObjectURL(responseAudioBlob));
                audio.play().catch((err) => {
                    console.warn("⚠️ 自動播放被瀏覽器阻擋:", err);
                });
            }
        } catch (error) {
            console.error("❌ API 請求失敗:", error);
        } finally {
            setIsUploading(false);
        }
    }, [selectedMode, isUploading]);

    useEffect(() => {
        if (audioBlob && audioBlob !== audioBlobRef.current) {
            audioBlobRef.current = audioBlob;  // 記錄已處理的音訊
            handleUpload(audioBlob);
        }
    }, [audioBlob, handleUpload]);

    useEffect(() => {
        return () => {
            if (audioURL) {
                URL.revokeObjectURL(audioURL);
            }
        };
    }, [audioURL]);

    return (
        <div>
            <h1>🎙️ AI 語音聊天機器人</h1>

            <label>
                選擇 AI 模式：
                <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
                    <option value="default">🌟 一般模式</option>
                    <option value="friendly">😊 友善模式</option>
                    <option value="professional">🧐 專業模式</option>
                    <option value="joking">😂 幽默模式</option>
                    <option value="teacher">📚 教師模式</option>
                    <option value="psychologist">🧠 心理諮詢模式</option>
                </select>
            </label>

            <button onClick={isRecording ? stopRecording : startRecording} disabled={isUploading}>
                {isUploading ? "⏳ 上傳中..." : isRecording ? "🛑 停止錄音" : "🎙️ 開始錄音"}
            </button>

            <p><strong>📝 語音轉文字：</strong> {text}</p>
            <p><strong>🤖 GPT AI 回應：</strong> {response}</p>

            {audioURL && (
                <div>
                    <p>🔊 AI 語音回應：</p>
                    <audio controls src={audioURL}></audio>
                </div>
            )}
        </div>
    );
};

export default App;
