# 费控王 - SAP Concur 开源替代方案

费控王是一个开源的费控管理云服务，专为企业提供高效、易用的费用控制和报销管理解决方案。本项目基于Steedos低代码平台开发，目的是提供一个灵活、可扩展的费用管理平台。

## 特点

- **开源与自由**：项目的大部分是开源的，可以自由修改和分发。
- **易于使用**：直观的用户界面，简化费用报销流程。
- **高度可定制**：基于Steedos低代码平台，易于定制和扩展。
- **安全可靠**：采用先进的安全措施保护数据安全。

## 源码运行

```shell
# 克隆仓库
git clone https://github.com/steedos/feikongwang
cd feikongwang

# 运行 mongodb & redis
docker-compose up mongodb redis

# 安装依赖
yarn

# 编译费控王
yarn build

# 运行费控王
yarn start
```


## Docker 运行

```
docker-compose build
docker-compose up
```

启动后访问 80 端口

## 功能

- 发票录入与查重
- 费用报销审批
- 收入管理
- 支出管理
- 审批流程管理
- 数据分析和报告
- 集成企业现有系统

如需获取企业版的更多信息和购买许可，请访问我们的[官方网站](https://feikongwang.com)。

## 在线试用

请访问[费控王云服务](https://feikongwang.com/)，点击右上角登录可以在线试用。

## 支持

如果您遇到任何问题或需要帮助，请通过[Issues](https://github.com/steedos/feikongwang/issues)提交。
