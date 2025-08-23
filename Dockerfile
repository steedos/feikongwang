# 使用官方的 Node.js 镜像作为构建阶段基础镜像
FROM node:22 AS builder

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json（如果有）到工作目录
COPY package*.json ./
# 复制项目文件到工作目录
COPY lerna.json ./
COPY steedos.config.js ./
COPY steedos-packages ./

# 安装项目依赖
RUN yarn install


# 执行构建命令，比如 TypeScript 项目需要进行 tsc 编译
RUN yarn run build

ENV PORT=80

# 暴露应用运行的端口，假设你的应用运行在端口3000
EXPOSE 80

# 启动应用
CMD ["yarn", "start"]