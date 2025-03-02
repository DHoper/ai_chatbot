import React, { useEffect, useRef } from "react";

interface ChatMessageProps {
    text?: string;
    audioURL?: string;
    audioId?: string; 
    autoPlay?: boolean; // ✅ 控制是否自動播放
}

/** ✅ AI 訊息泡泡 */
export const AiMessage: React.FC<ChatMessageProps> = ({ text, audioURL, audioId, autoPlay = false }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current.play().catch(err => console.warn("⚠️ AI 自動播放失敗:", err));
        }
    }, [autoPlay]);

    return (
        <div className="chat chat-start">
            <div className="chat-bubble bg-gray-200 text-gray-800 p-3">
                {text && <p>{text}</p>}
                {audioURL && (
                    <audio
                        id={audioId}
                        ref={audioRef}
                        controls
                        className="w-full mt-2 rounded-lg"
                    >
                        <source src={audioURL} type="audio/mpeg" />
                        您的瀏覽器不支援音頻播放。
                    </audio>
                )}
            </div>
        </div>
    );
};

/** ✅ 用戶訊息泡泡 */
export const UserMessage: React.FC<ChatMessageProps> = ({ text, audioURL, audioId }) => (
    <div className="chat chat-end">
        <div className="chat-bubble bg-blue-500 text-white p-3">
            {text && <p>{text}</p>}
            {audioURL && (
                <audio
                    id={audioId}
                    controls
                    className="w-full mt-2 rounded-lg"
                >
                    <source src={audioURL} type="audio/mpeg" />
                    您的瀏覽器不支援音頻播放。
                </audio>
            )}
        </div>
    </div>
);
