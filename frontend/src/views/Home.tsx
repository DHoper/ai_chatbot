import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-blue-500 to-indigo-600 text-white px-6 py-10">
            {/* Hero 區塊 */}
            <motion.div 
                className="w-full max-w-4xl text-center mt-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.h1 
                    className="text-4xl md:text-5xl font-bold tracking-wide mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    🎙️ 歡迎來到 <span className="text-yellow-300">TalkMate</span>
                </motion.h1>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                    AI 語音聊天助理，選擇一個對話情境，開始與 AI 交流吧！
                </p>
            </motion.div>

            {/* CTA 卡片 */}
            <motion.div 
                className="w-full max-w-md bg-white text-gray-900 rounded-2xl shadow-lg p-6 mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                <h2 className="text-2xl font-semibold text-center">開始對話</h2>
                <p className="text-center text-gray-600 mt-2">
                    在不同的真實情境中練習英語，與 AI 進行互動對話。
                </p>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate("/chat")}
                        className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2 text-black dark:text-white"
                    >
                        🚀 開始聊天
                    </button>
                </div>
            </motion.div>

            {/* 頁腳 */}
            <footer className="mt-16 text-sm text-gray-200 opacity-80">
                © {new Date().getFullYear()} TalkMate | 提升你的英語對話能力
            </footer>
        </div>
    );
};

export default Home;
