import React, { useState, useEffect, useRef, useCallback } from "react";
import ScenarioSelector, { ScenarioSelection } from "@/components/ScenarioSelector";
import AudioRecorder from "@/components/AudioRecorder";
import { processAudioWithAI } from "@/services/api";
import { AiMessage, UserMessage } from "@/components/ChatMessage";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/solid"; 

interface Message {
    type: "user" | "ai";
    text?: string;
    audioURL?: string;
}

const Chat: React.FC = () => {
    const [selectedScenario, setSelectedScenario] = useState<ScenarioSelection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [recorderKey, setRecorderKey] = useState<number>(0); // 用來重置 AudioRecorder
    const chatContainerRef = useRef<HTMLDivElement | null>(null);

    /** ✅ 處理語音輸入 */
    const handleAudioUpload = useCallback(async (audioBlob: Blob) => {
        // 檢查是否有語音資料
        if (!audioBlob || audioBlob.size === 0) {
            console.warn("沒有語音資料，無法發送 API");
            return;
        }

        if (!selectedScenario) return;

        // 使用者語音顯示
        const userAudioURL = URL.createObjectURL(audioBlob);
        setMessages(prevMessages => [...prevMessages, { type: "user", audioURL: userAudioURL }]);
        setIsProcessing(true);

        try {
            // 呼叫 API 處理語音
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
            // 重置 AudioRecorder，確保語音輸入狀態清空
            setRecorderKey(prevKey => prevKey + 1);
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
        chatContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900 shadow-lg overflow-hidden">
            {!selectedScenario ? (
                <ScenarioSelector onSelect={setSelectedScenario} />
            ) : (
                <>
                    {/* 🔙 頂部欄 (標題 + AI 角色頭像) */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4">
                        <button
                            className="flex items-center gap-2 btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-indigo-500"
                            onClick={() => setSelectedScenario(null)}
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-semibold">{selectedScenario.name}</h2>
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <img
                                    src={selectedScenario.ai_avatar}
                                    alt="AI 角色"
                                    className="" />
                            </div>
                        </div>
                    </div>

                    {/* 📜 聊天區域 */}
                    <div className="flex-1 pt-8 overflow-y-auto p-4 space-y-8 bg-gray-100 dark:bg-gray-800">
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

                        {/* 🌀 加載動畫，AI 回應時禁用錄音 */}
                        {isProcessing && (
                            <div className="flex justify-center items-center mt-4">
                                <span className="loading loading-dots loading-lg bg-indigo-500 text-sky-500"></span>
                            </div>
                        )}

                        <div ref={chatContainerRef}></div>
                    </div>

                    {/* 🎙️ 錄音按鈕 */}
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 border-t">
                        <AudioRecorder key={recorderKey} onAudioReady={handleAudioUpload} disabled={isProcessing} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;
