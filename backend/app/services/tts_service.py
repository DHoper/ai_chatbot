import openai
from io import BytesIO

class TTSService:
    def __init__(self, model="tts-1"):
        """初始化 OpenAI TTS 服務"""
        self.model = model  # OpenAI TTS Model

    def text_to_speech(self, text: str, voice_accent: str, voice_gender: str) -> BytesIO:
        """將文字轉換為語音，回傳 MP3 的 BytesIO 物件"""
        if not text.strip():
            raise ValueError("❌ TTS 文字輸入為空，無法產生語音")

        # ✅ **根據口音與性別選擇聲音**
        voice_map = {
            "american_male": "alloy",
            "american_female": "nova",
            "british_male": "onyx",
            "british_female": "shimmer"
        }
        voice_key = f"{voice_accent}_{voice_gender}"  # 生成 key
        voice = voice_map.get(voice_key, "alloy")  # 預設美式男性
        
        print(f"🔊 [TTS] 透過 OpenAI 產生語音：{text} (voice: {voice})")

        try:
            # **正確使用 OpenAI API**
            response = openai.audio.speech.create(
                model=self.model,
                voice=voice,
                input=text
            )

            # ✅ **確保 response 是二進制格式，讀取音訊流**
            audio_stream = BytesIO(response.content)  # 直接取用 `.content`
            audio_stream.seek(0)

            print("✅ [TTS] OpenAI 語音生成成功，回傳 BytesIO")
            return audio_stream

        except Exception as e:
            print(f"❌ OpenAI TTS 失敗: {str(e)}")
            raise ValueError(f"OpenAI TTS 失敗: {str(e)}")
