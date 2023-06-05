const fs = require('fs');

const deleteFile = (filePaths) => {
    fs.unlink(filePaths, (err) => {
        if(err){
            throw (err);
        }
    })
}

exports.deleteFile = deleteFile;