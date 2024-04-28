/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-04 17:02:52
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-09-27 10:00:32
 * @Description: 
 */
"use strict";
const project = require('./package.json');
const packageName = project.name;

const packageLoader = require('@steedos/service-package-loader');

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
            version: project.version,
            path: __dirname,
            isPackage: false
        }
    },

	/**
	 * Dependencies
	 */
	dependencies: ['steedos-server'],

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
		// console.log(require('chalk').blue('pm-'.repeat(10)));
		await this.broker.call('@steedos/service-project.addPackages', {
			packages: [
				{
					name: '@steedos-labs/contract',
					enable: true
				},
				{
					name: '@steedos-labs/cost',
					enable: true
				},
				{
					name: '@steedos-labs/demo-ee',
					enable: true
				},
				{
					name: '@steedos-labs/finance',
					enable: true
				},
				{
					name: '@steedos-labs/master',
					enable: true
				},
				{
					name: '@steedos-labs/project',
					enable: true
				},
				{
					name: '@steedos-labs/crm',
					enable: true
				},
				{
					name: '@steedos-labs/oa',
					enable: true
				},
				{
					name: '@steedos-labs/workflow',
					enable: true
				},
				{
					name: '@steedos-labs/gw',
					enable: true
				},
				{
					name: '@steedos-labs/okr',
					enable: false
				},
				{
					name: '@steedos-labs/merchant',
					enable: true
				},
				{
					name: '@steedos-labs/invoice',
					enable: true
				}
			]
		})
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
