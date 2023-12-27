/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-08 13:22:39
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-31 18:35:36
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/getOcrForm.js
 * @Description: ocr识别参数，不返回匹配发票验真接口所需的6要素信息
 */
"use strict";
// @ts-check

module.exports = {
    handler(data, mimetype) {
        const form = {}
        if (this.isImage(mimetype)) {
            // 图片
            form.image = data
        } else if (this.isPdf(mimetype)) {
            // PDF
            form.pdf_file = data
        }
        return form;
    }
}