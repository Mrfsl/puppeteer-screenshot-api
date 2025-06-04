FROM ghcr.io/puppeteer/puppeteer:latest

# 安装中文字体
USER root
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    fonts-noto-cjk \
    fonts-wqy-zenhei \
    fonts-wqy-microhei && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 回到 node 用户运行 Puppeteer（更安全）
USER pptruser

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001

CMD ["node", "index.js"]
