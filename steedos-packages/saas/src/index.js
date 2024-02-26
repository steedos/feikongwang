/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-04 17:02:52
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-26 15:58:21
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;

const packageLoader = require('@steedos/service-package-loader');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: process.env.STEEDOS_TENANT_ENABLE_SAAS == 'true' ? [] : [packageLoader],
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
	dependencies: ['~packages-standard-objects', '@steedos-labs/analytics'],

	/**
	 * Actions
	 */
	actions: {

	},

	/**
	 * Events
	 */
	events: {

    },
	
	/**
	 * Methods
	 */
	methods: {

	},

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
