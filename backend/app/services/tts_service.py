import openai
from io import BytesIO

class TTSService:
    def __init__(self, model="tts-1", voice="alloy"):
        """初始化 OpenAI TTS 服務"""
        self.model = model  # OpenAI TTS Model
        self.voice = voice  # 可選 "alloy", "echo", "fable", "onyx", "nova", "shimmer"

    def text_to_speech(self, text: str) -> BytesIO:
        """將文字轉換為語音，回傳 MP3 的 BytesIO 物件"""
        if not text.strip():
            raise ValueError("❌ TTS 文字輸入為空，無法產生語音")

        print(f"🔊 [TTS] 透過 OpenAI 產生語音：{text}")

        # 呼叫 OpenAI TTS API 產生語音
        response = openai.audio.speech.create(
            model=self.model,
            voice=self.voice,
            input=text
        )

        # 讀取音訊內容並存入 BytesIO
        audio_stream = BytesIO(response.content)
        audio_stream.seek(0)  # 讓指標回到起始位置，準備讀取

        print("✅ [TTS] OpenAI 語音生成成功，回傳 BytesIO")

        return audio_stream  # 直接回傳 MP3 串流
