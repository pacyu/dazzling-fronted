# 第一阶段：构建 (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖配置文件并安装依赖（这一步是为了利用 Docker 缓存）
COPY package*.json ./
RUN npm install

# 复制项目源码并构建
COPY . .
RUN npm run build

# 第二阶段：运行 (Runtime)
FROM nginx:alpine

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制打包好的静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]