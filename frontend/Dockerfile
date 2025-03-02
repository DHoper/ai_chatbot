# 使用 Node.js 來建置前端
FROM node:18 AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安裝前端依賴
RUN npm install

# 複製所有前端程式碼
COPY . .

# 建置前端應用
RUN npm run build

# 使用 Nginx 作為靜態檔案伺服器
FROM nginx:alpine

# 複製前端建置完成的檔案到 Nginx 伺服器
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露 Nginx 埠
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
