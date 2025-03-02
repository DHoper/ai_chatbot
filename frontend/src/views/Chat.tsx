import React, { useState, useEffect, useRef, useCallback } from "react";
import ScenarioSelector, { ScenarioSelection } from "@/components/ScenarioSelector";
import AudioRecorder from "@/components/AudioRecorder";
import { processAudioWithAI } from "@/services/api";
import { AiMessage, UserMessage } from "@/components/ChatMessage";
import { motion } from "framer-motion";

interface Message {
    type: "user" | "ai";
    text?: string;
    audioURL?: string;
}

const Chat: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<ScenarioSelection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    /** ✅ AI 開場白 */
    useEffect(() => {
        if (selectedScenario) {
            setIsProcessing(true);
            (async () => {
                try {
                    const { text, audioBlob: responseAudioBlob } = await processAudioWithAI(
                        new Blob(),
                        selectedScenario.mode, 
                        selectedScenario.topic,
                        selectedScenario.ai_persona,
                        selectedScenario.voice_accent,
                        selectedScenario.voice_gender
                    );

                    const audioUrl = responseAudioBlob ? URL.createObjectURL(responseAudioBlob) : "";
                    setMessages([{ type: "ai", text, audioURL: audioUrl }]);
                } catch (error) {
                    console.error("❌ 無法載入 AI 開場白:", error);
                } finally {
                    setIsProcessing(false);
                }
            })();
        }
    }, [selectedScenario]);

    /** ✅ 處理語音輸入 */
    const handleAudioUpload = useCallback(async (audioBlob: Blob) => {
        if (!selectedScenario) return;

        const userAudioURL = URL.createObjectURL(audioBlob);

        // ✅ 使用 `setMessages` 的函式更新方式，避免 messages 依賴問題
        setMessages(prevMessages => [...prevMessages, { type: "user", audioURL: userAudioURL }]);
        setIsProcessing(true);

        try {
            const { text, audioBlob: responseAudioBlob } = await processAudioWithAI(
                audioBlob,
                selectedScenario.mode,
                selectedScenario.topic,
                selectedScenario.ai_persona,
                selectedScenario.voice_accent,
                selectedScenario.voice_gender
            );

            const aiAudioURL = responseAudioBlob ? URL.createObjectURL(responseAudioBlob) : "";
            const aiMessage: Message = { type: "ai", text, audioURL: aiAudioURL };

            setMessages(prevMessages => [...prevMessages, aiMessage]);
        } catch (error) {
            console.error("❌ API 上傳失敗:", error);
        } finally {
            setIsProcessing(false);
        }
    }, [selectedScenario]);

    /** ✅ AI 回應後自動播放音訊 */
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.type === "ai" && lastMessage.audioURL) {
                const audioElement = document.getElementById(`ai-audio-${messages.length - 1}`) as HTMLAudioElement;
                if (audioElement) {
                    audioElement.play().catch(err => console.warn("⚠️ AI 音訊自動播放失敗:", err));
                }
            }
        }
    }, [messages]);

    /** ✅ 自動滾動到底部 */
    useEffect(() => {
        setTimeout(() => {
            chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className="flex flex-col h-screen w-full bg-white shadow-lg overflow-hidden">
            {!selectedScenario ? (
                <ScenarioSelector onSelect={setSelectedScenario} />
            ) : (
                <>
                    {/* 🔙 頂部欄 (標題 + AI 角色頭像) */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4">
                        <button 
                            className="btn btn-outline btn-sm text-white border-white" 
                            onClick={() => setSelectedScenario(null)}
                        >
                            🔙 返回
                        </button>
                        <h2 className="text-lg font-semibold">{selectedScenario.name}</h2>
                        <img 
                            src={selectedScenario.ai_avatar} 
                            alt="AI 角色" 
                            className="w-12 h-12 rounded-full border-2 border-white shadow-md" 
                        />
                    </div>

                    {/* 📜 聊天區域 */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                        {messages.map((msg, index) =>
                            msg.type === "ai" ? (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <AiMessage text={msg.text} audioURL={msg.audioURL} audioId={`ai-audio-${index}`} />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <UserMessage audioURL={msg.audioURL} audioId={`user-audio-${index}`} />
                                </motion.div>
                            )
                        )}

                        {/* 🌀 daisyUI 加載動畫，AI 回應時禁用錄音 */}
                        {isProcessing && (
                            <div className="flex justify-center items-center mt-4">
                                <span className="loading loading-infinity loading-lg text-blue-500"></span>
                            </div>
                        )}
                    </div>

                    {/* 🎙️ 錄音按鈕 */}
                    <div className="p-4 bg-white border-t">
                        <AudioRecorder onAudioReady={handleAudioUpload} disabled={isProcessing} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;
