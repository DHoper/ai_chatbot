import json
import os

class GPTPromptManager:
    def __init__(self, prompt_file="utils/gpt_prompts.json"):
        """初始化 GPT Prompt 管理器"""
        self.prompt_file = prompt_file
        self.prompts = self._load_prompts()

    def _load_prompts(self):
        """從 JSON 檔案加載所有 Prompt"""
        if not os.path.exists(self.prompt_file):
            raise FileNotFoundError(f"找不到 Prompt 設定檔: {self.prompt_file}")

        with open(self.prompt_file, "r", encoding="utf-8") as file:
            return json.load(file)

    def get_prompt(self, mode="default"):
        """取得指定模式的 GPT Prompt，如果不存在則回傳預設值"""
        return self.prompts.get(mode, self.prompts["default"])
