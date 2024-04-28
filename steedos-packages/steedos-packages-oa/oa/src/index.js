/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-09 11:47:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:08:21
 * @Description: 
 */
const path = require('path');
const project = require('../package.json');
const packageName = project.name;
const packageLoader = require('@steedos/service-package-loader');

const triggers = require('./triggers/index.js');
const rests = require('./rests/index.js');

module.exports = {
    name: packageName,
    namespace: "steedos",
    mixins: [packageLoader],
    dependencies: [],
    settings: {

    },
    metadata: {
        $package: {
            name: project.name,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },
    actions: {
        ...triggers,
        ...rests
    },
    methods: {
    },

    async started() {
    }

}