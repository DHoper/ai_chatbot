from fastapi import APIRouter, HTTPException, UploadFile, File, Response
from app.services.stt_service import STTService
from app.services.chat_service import ChatService
from app.services.tts_service import TTSService
from io import BytesIO
from pydub import AudioSegment
import base64
from fastapi.responses import JSONResponse

router = APIRouter()

# 初始化服務
whisper_service = STTService()  # Whisper 語音轉文字
chat_service = ChatService()  # GPT 生成對話
tts_service = TTSService()  # TTS 生成語音

@router.post("/chat")
async def chat_with_gpt(file: UploadFile = File(...), mode: str = "default"):
    try:
        # **確保收到音訊文件**
        if not file:
            raise HTTPException(status_code=400, detail="未收到語音文件")

        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="語音文件為空")

        # **轉換 `WEBM` 為 `WAV`**
        audio_stream = BytesIO(audio_bytes)
        audio_stream.seek(0)

        try:
            audio = AudioSegment.from_file(audio_stream, format="webm")  # ✅ 明確指定 `webm`
            audio = audio.set_frame_rate(16000).set_channels(1)

            wav_stream = BytesIO()
            audio.export(wav_stream, format="wav")
            wav_stream.seek(0)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"音訊格式轉換失敗: {str(e)}")

        # **🎤 Whisper 語音轉文字 (STT)**
        text = whisper_service.transcribe_audio(wav_stream)

        if not text.strip():
            raise HTTPException(status_code=400, detail="Whisper 無法解析語音")

        # **🤖 GPT 產生 AI 回應**
        response_text = chat_service.get_response(text, mode)

        # **🔊 TTS 轉換 AI 回應為語音**
        audio_bytes_io = tts_service.text_to_speech(response_text)

        # **轉為 Base64**
        audio_base64 = base64.b64encode(audio_bytes_io.getvalue()).decode("utf-8")

        # **回傳 JSON**
        return JSONResponse(
            content={"text": response_text, "audio": audio_base64}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
