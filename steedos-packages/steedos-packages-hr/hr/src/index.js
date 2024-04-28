/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-19 10:19:30
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:06:17
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;

const packageLoader = require('@steedos/service-package-loader');

const rests = require('./rest');
const triggers = require('./triggers');
const actions = require('./actions');
const methods = require('./methods');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		
	},
    metadata: {
        $package: {
            name: project.name,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },

	/**
	 * Dependencies
	 */
	dependencies: ['~packages-standard-objects'],

	/**
	 * Actions
	 */
	actions: {
		...rests,
		...triggers,
		...actions,
		// 获取image地址
		getIconAction: {
			rest: {
				method: "GET",
				fullPath: "/hr/image/:name",
			},
			async handler(ctx) {
				const fs = require('fs');
				const path = require('path');
				const { name } = ctx.params;
				ctx.meta.$responseType = "image/png";
				// 构建完整的文件路径
				const pngPath = path.join(__dirname, "..",'image', name)
				// 读取 PNG 图像文件数据
				let PngBuffer = fs.readFileSync(pngPath);
				return Buffer.from(PngBuffer)
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: methods,

	/**
	 * Service created lifecycle event handler
	 */
	async created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
