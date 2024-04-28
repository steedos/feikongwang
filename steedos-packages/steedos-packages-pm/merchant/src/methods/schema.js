module.exports = {
	/**
	 * 获取置入tableView中的数据
	 * @param {string} userId 
	 * @returns tableViewData
	 */
    async getTableViewData (userId) {
		return  await this.broker.call(
			'objectql.aggregate', 
			{
			  objectName: 'assess_evaluation',
			  query: {},
			  externalPipeline: this.getPipeline(userId)
			}
		)
    },

	/**
	 * 获取tableView的 schema
	 * @param {*} tableData 需要显示的数据
	 * @returns tableView schema
	 */
    getTableViewSchema (tableData) {

		let baseSchema = {
			"type": "table-view",
			"trs": [
			  {
				"background": "#F7F7F7",
				"tds": [
				  {"body": {"type": "tpl", "tpl": "供应商"} },
				  {"body": {"type": "tpl", "tpl": "评分模版"} },
				  {"body": {"type": "tpl", "tpl": "模版权重"} },
				  {"body": {"type": "tpl", "tpl": "是否完成"} },
				  {"body": {"type": "tpl", "tpl": "操作"} }
				]
			  }
			]
		};

		for (let i = 0; i < tableData.length; i ++ ) {
			let row = tableData[i];

			for(let j = 0; j < row.template.length; j ++ ) {
				let template = row.template[j];
				let rowSchema = [];
				if (j === 0) {
					rowSchema.push({"rowspan": row.template.length, "body": {"type": "tpl", "tpl": row.supplier_name} });	
				}
				// 行数据
				rowSchema.push({"body": {"type": "tpl", "tpl": template.name} });
				rowSchema.push({"body": {"type": "tpl", "tpl": "" + template.template_weight * 100 + "%"} });
				rowSchema.push({"body": {"type": "tpl", "tpl": "<%  if (" + template.finished + ") { %>\n    <span class=\"slds-icon_container slds-icon-utility-check slds-current-color\">\n        <span ><%= "+ template.finished + " ? \"<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='w-4 h-4'><path stroke-linecap='round' stroke-linejoin='round' d='M4.5 12.75l6 6 9-13.5' /></svg>\" : '' %></span>\n    </span>\n    <% } %>" } });
				// 按钮弹出内容
				const buttonSchema = {
					"body": {
					  "label": "评分",
					  "type": "button",
					  "actionType": "dialog",
					  "dialog": {
						"title": "填写评分",
						"body": [
							{
							  "type": "steedos-object-table",
							  "label": "对象表格",
							  "objectApiName": "assess_template_score",
							  "fields": [
								"supplier",
								"template_item",
								"content",
								"template_item_weight",
								"score"
							  ],
							  "className": "sm:border sm:rounded sm:border-gray-300",
							  "amisCondition": {
								"conjunction": "and",
								"children": [
								  {
									"id": "be4d3f50a338",
									"left": {
									  "type": "field",
									  "field": "assess_evaluation"
									},
									"op": "select_equals",
									"right": template.assess_evaluation
								  }
								]
							  },
							  "crud": {
								"headerToolbar": [],
								"footerToolbar": []
							  }
							}
						],
						"showCloseButton": true,
						"showErrorMsg": true,
						"showLoading": true,
						"className": "app-popover",
						"size": "md",
						"closeOnEsc": false,
						"onEvent": {
						  "confirm": {
							"weight": 0,
							"actions": [
							  {
									"actionType": "ajax",
									"outputVar": "responseResult",
									"args": {
									  "options": {},
									  "api": {
										"url": "/api/evaluation/score/update",
										"method": "post",
										"requestAdaptor": "",
										"adaptor": "payload.data.status = payload.status; return payload;",
										"messages": {},
										"headers": {
										  "Authorization": "Bearer ${context.tenantId},${context.authToken}"
										},
										"data": {
										  "assess_evaluation": template.assess_evaluation,
										  "assess_evaluation_score": template.assess_evaluation_score
										}
									  }
									}
							  },
							  {
								"actionType": "custom",
								"script": "",
								"preventDefault": "${event.data.status == 500}"
							  },
							  {
								"actionType": "reload",
								"componentId": "tableview_service",
								"dataMergeMode": "merge"
							  }
							]
						  }
						}
					  }
					}
				};
				rowSchema.push(buttonSchema);
				baseSchema["trs"].push({"tds": rowSchema})
			}
		}
		return baseSchema;
    },

	/**
	 * 获取aggregation的聚合条件
	 * @param {*} userId 
	 * @returns pipeline
	 */
	getPipeline(userId) {
		return [
		  {
			'$match':  {"$and": [
			  {"assessor": userId},
			  {"used": {"$ne": true}}
			]}
		  },
		  {
			"$lookup": {
			  "from": "accounts",
			  "localField": "supplier",
			  "foreignField": "_id",
			  "as": "supplier_detail"
			}
		  },
		  {
			"$lookup": {
			  "from": "assess_template",
			  "localField": "template",
			  "foreignField": "_id",
			  "as": "template_detail"
			}
		  },
		  {
			"$unwind": {
			  "path": "$supplier_detail",
			  "preserveNullAndEmptyArrays": false
			}
		  },
		  {
			"$unwind": {
			  "path": "$template_detail",
			  "preserveNullAndEmptyArrays": false
			}
		  },
		  {
			"$addFields": {
			  "template_detail": {
				"$mergeObjects": [
				  "$template_detail", 
				  {"template_weight": "$template_weight", "finished": "$finished", "assess_evaluation": "$_id", "assess_evaluation_score": "$assess_evaluation_score"},
				  
				]
			  }
			}
		  },
		  {
			"$group": {
			  "_id": "$supplier",
			  "template": {"$push": "$template_detail"},
			  "supplier_name": {"$first": "$supplier_detail.name"}
			}
		  },
		  {
			"$addFields": {
			  "supplier": "$_id"
			}
		  },
		  {
			"$project": {
			  "_id": 0,
			  "supplier": 1,
			  "supplier_name": 1,
			  "template": 1,
			}
		  }
		]
	}
}