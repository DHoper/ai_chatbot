import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">🎙️ AI 語音聊天機器人</h1>
            <p className="text-lg text-gray-600 mb-6">
                Select a conversation scenario and start practicing with AI!
            </p>
            <button
                onClick={() => navigate("/chat")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200"
            >
                🚀 Start Chatting
            </button>
        </div>
    );
};

export default Home;
