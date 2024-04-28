/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-10-07 11:32:10
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-18 14:03:28
 * @Description: 供应商评估-”添加评估“按钮相关接口
 */
const _ = require('lodash');
const KEY_LENGTH = require('../consts/index.js').TABLE_OBJECT_KEY_LENGTH;

module.exports = {
    /**
     * 添加供应商评估inputTable表单数据
     */
    increase: {
        rest: {
            method: "POST",
            fullPath: "/api/increase/evaluation/account"
        },
        params: {
            "suppliers": {type: "array"},
            "assessors": {type: "array"},
            "templates": {type: "array"}
        },
        async handler(ctx) {
            const { assessors, suppliers, templates } = ctx.params;
            let data = [];

            for (let i = 0; i < suppliers.length; i++) {
              let supplier = suppliers[i];
            
              for (let j = 0; j < assessors.length; j++) {
                let assessor = assessors[j];

                for (let k = 0; k < templates.length; k ++ ) {
                    let template = templates[k];

                    let entity = {
                        'supplier': supplier,
                        'assessor': assessor,
                        'template': template
                    };
                    data.push(entity);
                }

              }
            }
            
            return {'status': 0, 'msg': "", 'data': {'items': data}};
        }
    },

    /**
     * 将填写完整的数据添加到供应商评估中
     */
    addToEvaluation: {
        rest: {
            method: "POST",
            fullPath: "/api/increase/evaluation"
        },
        async handler(ctx) {
            const { table, name, end_date } = ctx.params;
            const user = ctx.meta.user;

            if (!name || !end_date) {
                return {'status': 500, 'msg': '请补充标题或日期','data': {}};
            }
    
            if (!table || table.length < 1) {
                return {'status': 500, 'msg': '表单为空！请填写数据','data': {}};
            }
            
            try {
                // 判断数据是否填写完成
                for (let i = 0; i < table.length; i ++ ) {
                    let row = table[i];
                    if (row && Object.keys(row).length === KEY_LENGTH) { // 此写法需要优化
                        continue;
                    } else {
                        return {'status': 500, 'msg': `请补充第${i + 1}行数据`,'data': {}};
                    }
                }
                
                // 插入数据
                for (const row of table) {
                    let insertDoc = Object.assign(row, {
                        'space': user.spaceId, 
                        'name': name, 
                        'end_date': end_date, 
                        'finished': false,
                        'template_weight': row.template_weight,
                        'assessor_weight': row.assessor_weight
                    });
                    // 同时将数据插入到供应商评分中
                    const assess_evaluation_score = await ctx.broker.call(
                        'objectql.insert',
                        {
                            'objectName': 'assess_evaluation_score', 
                            'doc': insertDoc
                        }   
                    );
                    const res = await ctx.broker.call(
                        'objectql.insert',
                        {
                            'objectName': 'assess_evaluation', 
                            'doc': Object.assign(insertDoc, {'assess_evaluation_score': assess_evaluation_score._id})
                        }   
                    );
  
                    await this.addEvaluationItem(row, res._id, assess_evaluation_score._id, user) ;
                }

                return  {'status': 0, 'msg': '', 'data': {}};
                
            } catch (error) {
                console.error(error);
                return  {'status': 500, 'msg': error, 'data': {}};
            }
        }
    }
}