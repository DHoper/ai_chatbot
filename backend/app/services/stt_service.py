import whisper
import numpy as np
import librosa
from io import BytesIO

class STTService:
    def __init__(self, model_size="medium"):
        """初始化 Whisper 模型"""
        print(f"🚀 加載 Whisper 模型: {model_size}")
        self.model = whisper.load_model(model_size)

    def transcribe_audio(self, wav_stream: BytesIO, language="zh") -> str:
        """接收 WAV 格式音訊 (BytesIO)，並使用 Whisper 轉錄"""
        try:
            print(f"🎙️ [DEBUG] Whisper 轉錄中... 語言: {language}")

            # 讀取 BytesIO 內的 WAV，轉為 NumPy 陣列
            wav_stream.seek(0)  # 重新定位到檔案開頭
            audio_data, sample_rate = librosa.load(wav_stream, sr=16000, mono=True)  # 確保 16kHz 單聲道

            print(f"✅ [DEBUG] 音訊轉換成功: {audio_data.shape}, 取樣率: {sample_rate}")

            # 🎤 Whisper 轉錄音訊
            result = self.model.transcribe(audio_data, language=language)
            print(f"✅ [Whisper Output]: {result['text']}")

            return result["text"]

        except Exception as e:
            print(f"❌ [ERROR] Whisper 轉錄失敗: {str(e)}")
            return "Whisper 無法處理此音訊。"
