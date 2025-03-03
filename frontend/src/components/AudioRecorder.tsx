import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useAudioRecorder from "@/hooks/useAudioRecorder";

interface AudioRecorderProps {
    onAudioReady: (audioBlob: Blob) => void;
    disabled?: boolean; // ✅ 新增 `disabled` 屬性，確保 AI 回應時不能錄音
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, disabled = false }) => {
    const { isRecording, startRecording, stopRecording, audioBlob } = useAudioRecorder();

    useEffect(() => {
        if (audioBlob) {
            onAudioReady(audioBlob);
        }
    }, [audioBlob, onAudioReady]);

    return (
        <div className="flex flex-col items-center">
            <motion.button
                whileHover={{ scale: disabled ? 1.0 : 1.1 }} // 禁用時不變化
                whileTap={{ scale: disabled ? 1.0 : 0.9 }}   // 禁用時不變化
                onClick={!disabled ? (isRecording ? stopRecording : startRecording) : undefined}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 shadow-lg ${
                    isRecording ? "bg-red-500 animate-pulse" : "bg-white"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} // ✅ 禁用時透明度降低
                disabled={disabled} // ✅ 確保按鈕真的被禁用
            >
                {isRecording ? "🛑" : "🎙️"}
            </motion.button>

            {/* 錄音中顯示動畫 */}
            {/* {isRecording && <span className="loading loading-ring loading-lg text-red-500 mt-4"></span>} */}
        </div>
    );
};

export default AudioRecorder;
