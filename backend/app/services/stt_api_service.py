from services.openai_client import OpenAIClient
from io import BytesIO

# ✅ **取得共用 OpenAI 客戶端**
client = OpenAIClient.get_client()

class STTService:
    def __init__(self, model="whisper-1"):
        self.model = model

    def transcribe_audio(self, wav_stream: BytesIO) -> str:
        """ 接收 WAV 音訊並轉錄為文字 """
        try:
            wav_stream.seek(0)
            wav_stream.name = "audio.wav"
            
            result = client.audio.transcriptions.create(
                model=self.model,
                file=wav_stream
            )
            return result.text if result else "Whisper 無法解析語音"

        except Exception as e:
            print(f"❌ OpenAI STT 錯誤: {str(e)}")
            return "Whisper 無法解析語音。"
