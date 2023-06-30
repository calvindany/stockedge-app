const fs = require('fs');
const path = require('path')

const deleteFile = (filePaths) => {
    fs.unlink(filePaths, (err) => {
        if(err){
            throw (err);
        }
    })
}

const renameFile = (fileName) => {
    const previousPaths = path.join(__dirname, '../public/images/') + 'temp_' + fileName
    const newPaths = path.join(__dirname, '../public/images/') + fileName

    fs.rename(previousPaths, newPaths, (err) => {
        if(err) {
            console.log(err);
        }
        console.log('aa')
    })
}

module.exports = {
    deleteFile,
    renameFile
};