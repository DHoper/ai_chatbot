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
            <div className="chat-bubble chat-bubble-accent text-white px-6 py-4 rounded-xl shadow-md max-w-2xs md:max-w-xs lg:max-w-md">
                {text && <p className="leading-relaxed">{text}</p>}
                {audioURL && (
                    <audio
                        id={audioId}
                        ref={audioRef}
                        controls
                        controlsList="nodownload noplaybackrate"
                        className="w-full min-w-3xs h-8 mt-4 rounded"
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
        <div className="chat-bubble bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-md max-w-2xs md:max-w-xs lg:max-w-md">
            {text && <p className="leading-relaxed">{text}</p>}
            {audioURL && (
                <audio
                    id={audioId}
                    controls
                    controlsList="nodownload noplaybackrate"
                    className="w-full min-w-3xs h-8 mt-4 rounded"
                >
                    <source src={audioURL} type="audio/mpeg" />
                    您的瀏覽器不支援音頻播放。
                </audio>
            )}
        </div>
    </div>
);
