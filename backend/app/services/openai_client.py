from openai import OpenAI
from config import OPENAI_API_KEY

# ✅ **統一管理 OpenAI API 初始化**
class OpenAIClient:
    _client = None  # 類變數，確保所有服務共用同一個 OpenAI 實例

    @classmethod
    def get_client(cls):
        """ 確保只初始化一次 OpenAI 客戶端 """
        if cls._client is None:
            cls._client = OpenAI(api_key=OPENAI_API_KEY)
        return cls._client
