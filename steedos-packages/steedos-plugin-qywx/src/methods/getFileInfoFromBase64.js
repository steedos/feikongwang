module.exports = {
    handler(fileBase64) {
        const data = fileBase64.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", '');
        const mimetype = fileBase64.split(",")[0].match(/:(.*?);/)[1];
        return {
            mime: mimetype,
            data: data
        }
    }
}