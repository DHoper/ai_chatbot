from openai import OpenAI
from app.utils.gpt_prompt_manager import GPTPromptManager


# 創建 OpenAI 客戶端
client = OpenAI()

# 初始化 GPT Prompt 管理器
prompt_manager = GPTPromptManager()

class ChatService:
    def __init__(self, model="gpt-4o-mini"):
        """初始化 GPT 聊天服務"""
        self.model = model

    def get_response(self, user_message: str, mode: str = "default", prompt: str = "",
                     voice_accent: str = "american", voice_gender: str = "male",
                     topic: str = "", ai_persona: str = "") -> str:
        """
        取得 GPT 回應，**確保 AI 人設、語音風格、主題設定都正確傳遞**
        """
        try:
            print(f"🎯 [Topic]: {topic}")
            print(f"🎭 [AI Persona]: {ai_persona}")
            print(f"🗣️ [Voice Accent]: {voice_accent}, [Gender]: {voice_gender}")
            print(f"🎭 [Selected Mode]: {mode}")
            print(f"💡 [Custom Prompt]: {prompt}")

            # ✅ 獲取模式對應的 `system_prompt`
            system_prompt = prompt_manager.get_prompt(mode)

            # ✅ **合併 AI 角色**
            if ai_persona:
                system_prompt = f"{ai_persona}\n\n{system_prompt}"

            # ✅ **確保 AI 知道對話主題**
            if topic:
                system_prompt += f"\n\n[IMPORTANT] The conversation must focus on '{topic}'. If the user talks about something unrelated, politely guide them back."

            # ✅ **確保 AI 遵守語音風格**
            system_prompt += f"\n\n[NOTE] You should respond as a {voice_accent} {voice_gender} speaker."

            print(f"💡 [Final System Prompt]: {system_prompt}")

            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},  # ✅ AI 角色、主題、語音風格
                    {"role": "user", "content": user_message}  # ✅ 用戶輸入
                ],
                max_tokens=200
            )

            # 確保 API 回應有效
            if not response or not response.choices:
                raise ValueError("❌ GPT 回應無效")

            # ✅ 取得 AI 回應
            ai_response = response.choices[0].message.content
            print(f"🤖 [GPT Response]: {ai_response}")

            return ai_response

        except Exception as e:
            print(f"❌ [ERROR] GPT 發生錯誤: {str(e)}")
            return "抱歉，處理您的請求時發生錯誤。請稍後再試。"
