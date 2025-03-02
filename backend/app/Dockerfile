# 使用官方 Python 3.10 映像
FROM python:3.10

# 設定工作目錄
WORKDIR /app

# 複製專案檔案
COPY ./app /app

# 安裝依賴
RUN pip install --no-cache-dir --upgrade pip \
    && pip install -r /app/requirements.txt

# 設定環境變數（可選）
ENV PORT=8000

# 暴露應用埠
EXPOSE 8000

# 啟動應用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
