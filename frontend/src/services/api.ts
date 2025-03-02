import axios from "axios";

const API_URL = "http://localhost:8000";

/**
 * 上傳語音，讓後端處理 STT + GPT + TTS，返回 AI 回應與語音 Blob
 * @param file 語音檔案 (Blob)
 * @param mode AI 模式（可選，如 "default", "friendly", "joking"）
 * @returns AI 文字回應與 TTS 音頻 Blob
 */
export const processAudioWithAI = async (
    file: Blob,
    mode: string = "default"
): Promise<{ text: string; audioBlob: Blob }> => {
    try {
        const formData = new FormData();
        formData.append("file", file); // **✅ 保持原始檔名**

        // 🚀 發送請求到後端 API
        const response = await axios.post(`${API_URL}/chat?mode=${mode}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // **🔍 解析 JSON 回應**
        const { text, audio } = response.data;

        // **🔊 轉換 Base64 為 Blob**
        const audioBlob = new Blob([Uint8Array.from(atob(audio), c => c.charCodeAt(0))], {
            type: "audio/mpeg",
        });

        return { text, audioBlob };
    } catch (error) {
        console.error("❌ 錯誤:", error);
        throw error;
    }
};
