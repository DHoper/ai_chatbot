import os
from openai import OpenAI
from dotenv import load_dotenv
from app.utils.gpt_prompt_manager import GPTPromptManager

# 加載環境變數
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 創建 OpenAI 客戶端（新版 SDK 無需 api_key 參數）
client = OpenAI()

# 初始化 GPT Prompt 管理器
prompt_manager = GPTPromptManager()

class ChatService:
    def __init__(self, model="gpt-4o-mini"):
        """初始化 GPT 聊天服務"""
        self.model = model

    def get_response(self, user_message: str, mode="default") -> str:
        """根據模式選擇不同的 GPT Prompt，並獲取 GPT 回應"""
        try:
            print("🚀 [DEBUG] 開始處理 GPT 請求...")
            print(f"📝 [User Message] {user_message}")
            print(f"🎭 [Selected Mode] {mode}")

            # 獲取模式對應的 prompt
            system_prompt = prompt_manager.get_prompt(mode)
            print(f"💡 [System Prompt] {system_prompt}")

            # 發送請求到 OpenAI API
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=200
            )

            # 檢查 API 回應是否有效
            if not response or not response.choices:
                raise ValueError("❌ GPT 回應無效，請求失敗")

            # 取得 GPT 回應
            ai_response = response.choices[0].message.content
            print(f"🤖 [GPT Response]: {ai_response}")

            return ai_response

        except Exception as e:
            print(f"❌ [ERROR] GPT 處理發生錯誤: {str(e)}")
            return "抱歉，處理您的請求時發生錯誤。請稍後再試。"
