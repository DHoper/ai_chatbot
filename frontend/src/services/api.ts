import axios from "axios";

const API_URL = "http://localhost:8000";

/**
 * 上傳語音，讓後端處理 STT + GPT + TTS，返回 AI 回應與語音 Blob
 * @param file 語音檔案 (Blob)
 * @param mode AI 模式（可選，如 "default", "friendly", "joking"）
 * @param prompt 自訂 AI 提示詞（可選）
 * @param voice_accent AI 語音口音 ("american" 或 "british")
 * @param voice_gender AI 語音性別 ("male" 或 "female")
 * @param topic 本次對話的主題 (確保 AI 引導對話回主題)
 * @param ai_persona 本次 AI 的人設 (確保 AI 遵守角色設定)
 * @returns AI 文字回應與 TTS 音頻 Blob
 */
export const processAudioWithAI = async (
    file: Blob,
    mode: string = "default",
    topic: string = "",
    ai_persona: string = "",
    voice_accent: string = "american",
    voice_gender: string = "male",
    prompt: string = "",
): Promise<{ text: string; audioBlob: Blob }> => {
    try {
        const formData = new FormData();
        formData.append("file", file); 
        formData.append("mode", mode);
        formData.append("prompt", prompt);
        formData.append("voice_accent", voice_accent);
        formData.append("voice_gender", voice_gender);
        formData.append("topic", topic);
        formData.append("ai_persona", ai_persona); 

        const response = await axios.post(`${API_URL}/chat`, formData);

        const { text, audio } = response.data;

        let audioBlob;
        try {
            // 轉換 Base64 為 Blob
            const byteArray = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
            audioBlob = new Blob([byteArray], { type: "audio/mpeg" });
        } catch (error) {
            console.error("❌ 音頻轉換錯誤:", error);
            throw new Error("音頻解碼失敗，請稍後再試");
        }

        return { text, audioBlob };
    } catch (error) {
        console.error("❌ API 請求錯誤:", error);
        throw error;
    }
};
