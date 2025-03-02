from fastapi import APIRouter, HTTPException, UploadFile, File, Request
from services.stt_api_service import STTService
from services.chat_service import ChatService
from services.tts_service import TTSService
from io import BytesIO
from pydub import AudioSegment
import base64
from fastapi.responses import JSONResponse

router = APIRouter()

# ✅ 初始化服務
whisper_service = STTService()  # Whisper 語音轉文字
chat_service = ChatService()  # GPT 生成對話
tts_service = TTSService()  # TTS 生成語音

@router.post("/chat")
async def chat_with_gpt(request: Request):
    formData = await request.form()

    print("收到的 Form Data:")
    for key, value in formData.items():
        print(f"{key}: {value}")

    try:
        # ✅ **取得表單數據**
        file = formData.get("file")  # 確保使用 `get`
        mode = formData.get("mode", "default")
        prompt = formData.get("prompt", "")
        topic = formData.get("topic", "")
        ai_persona = formData.get("ai_persona", "")
        voice_accent = formData.get("voice_accent", "default")
        voice_gender = formData.get("voice_gender", "neutral")

        print(f"模式: {mode}, 提示: {prompt}, 主題: {topic}, 角色: {ai_persona}, 口音: {voice_accent}, 性別: {voice_gender}")

        # ✅ **確保收到音訊文件**
        if not file:
            raise HTTPException(status_code=400, detail="未收到語音文件")

        audio_bytes = await file.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="語音文件為空")

        # ✅ **轉換 `WEBM` 為 `WAV`**
        try:
            audio_stream = BytesIO(audio_bytes)
            audio = AudioSegment.from_file(audio_stream, format="webm")  
            audio = audio.set_frame_rate(16000).set_channels(1)

            wav_stream = BytesIO()
            audio.export(wav_stream, format="wav")
            wav_stream.seek(0)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"音訊格式轉換失敗: {str(e)}")

        # ✅ **🎤 Whisper 語音轉文字 (STT)**
        user_message = whisper_service.transcribe_audio(wav_stream)
        print("user_message :" + user_message)

        if not user_message.strip():
            raise HTTPException(status_code=400, detail="Whisper 無法解析語音")

        print("🚀 [Route] 正在生成 GPT 回應...")

        # ✅ **🤖 GPT 產生 AI 回應**
        try:
            response_text = chat_service.get_response(
                user_message=user_message, 
                mode=mode,
                prompt=prompt,
                voice_accent=voice_accent,
                voice_gender=voice_gender,
                topic=topic,
                ai_persona=ai_persona
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"生成 GPT 回應失敗: {str(e)}")

        print("🚀 [Route] 正在轉換回應為語音...")

        # ✅ **🔊 TTS 轉換 AI 回應為語音**
        try:
            audio_bytes_io = tts_service.text_to_speech(response_text, voice_accent, voice_gender)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"TTS 產生語音失敗: {str(e)}")

        # ✅ **轉為 Base64**
        audio_base64 = base64.b64encode(audio_bytes_io.getvalue()).decode("utf-8")

        # ✅ **回傳 JSON**
        return JSONResponse(
            content={
                "text": response_text,
                "audio": audio_base64
            }
        )

    except HTTPException as http_ex:
        raise http_ex  # 已知錯誤直接拋出
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"伺服器錯誤: {str(e)}")
