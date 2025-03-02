# 1️⃣ 使用 Node.js 來建置前端
FROM node:18 AS build

# 2️⃣ 設定工作目錄到 /app
WORKDIR /app

# 3️⃣ 複製 package.json 和 package-lock.json 來快取依賴
COPY package.json package-lock.json ./

# 4️⃣ 安裝前端依賴
RUN npm install

# 5️⃣ 複製 frontend 內的所有程式碼
COPY . . 

# 6️⃣ 使用 Vite 編譯前端應用
RUN npm run build

# 7️⃣ 使用輕量版 Nginx 作為靜態檔案伺服器
FROM nginx:alpine

# 8️⃣ 複製前端建置完成的檔案到 Nginx 伺服器
COPY --from=build /app/dist /usr/share/nginx/html

# 9️⃣ 暴露 Nginx 80 端口
EXPOSE 80

# 🔟 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
