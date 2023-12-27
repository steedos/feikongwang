const fs = require('fs')
module.exports = {
    handler (tempFilePath) {
        return fs.unlinkSync(tempFilePath);
    }
}