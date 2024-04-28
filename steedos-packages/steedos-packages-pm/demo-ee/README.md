<!--
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-12-01 19:13:07
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-12-01 19:13:46
 * @Description: 
-->
## saas-demo
- 提供演示数据
- 安装软件包后自动写入演示数据、支持更新演示数据
- 演示数据存放目录`main\default\data`
- 数据后缀名
  - xx`.data.json`
  - xx`.data.csv`
  - xx`.flow.data.json`

## 使用mongodb cli 导出演示数据
- json: 使用命令导出。例如: `mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps"  --jsonArray --collection=contract_types  --out=contract_types.data.json`
- csv: 使用命令导出。例如: `mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps"  --collection=contract_types --type=csv --fields=name,code --out=contract_types.data.csv`

## 编码要求
json、csv中文件请使用`utf-8`编码

## 导入数据方式
- 自动导入：软件包启动后，会自动导入`main\default\data`下所有xx.data.json、xx.data.csv、xx.flow.json数据
- 手动导入：调用actions导入，新开命令窗口，并进入项目根路径，执行以下2条命令
```
yarn console
```
```
call "@steedos-labs/demo-project.importData"
```
- action: importData
  - 参数：onlyInsert，默认值true。如果为true，仅导入，在导入数据之前先检查，如果存在任意一条记录，则不执行导入。如果是false, 则如果存在则执行update操作。

## 示例，导出合同模块数据， 进入`main\default\data`文件夹后执行以下命令
```
mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps"  --collection=contract_types --type=csv --fields=name,code --out=contract_types.data.csv

mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps" --jsonArray --collection=contracts  --out=contracts.data.json

mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps" --jsonArray --collection=accounts  --out=accounts.data.json

mongoexport --uri="mongodb://192.168.3.31:27017/steedos-apps" --jsonArray --collection=currency  --out=currency.data.json
```
