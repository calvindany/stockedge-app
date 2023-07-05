const {Storage} = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp')
const pathKey = path.resolve('./service-account.json');

// TODO: Sesuaikan konfigurasi Storage
const cloudStorage = new Storage({
    projectId: 'stockedge-app',
    keyFilename: pathKey
});

// TODO: Tambahkan nama bucket yang digunakan
const bucketName = 'image-asset-stockedge-app';
const bucket = cloudStorage.bucket(bucketName)

function getPublicUrlInvoiceAsset(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/invoice-asset/' + filename;
}
function getPublicUrlWebAsset(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/web-asset/' + filename;
}

exports.uploadToGcsWebAsset = (req, res, next) => {
    if (!req.file) return next();

    const gcsname = Date.now() + '.' + req.file.mimetype.split('/')[1];
    const file = bucket.file('web-asset/' + gcsname);

    sharp(req.file.buffer)
    .resize(400, 400)
    .toBuffer()
    .then( resizedImageBuffer => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
    
        stream.on('error', (err) => {
            req.file.cloudStorageError = err
            console.log(err);
            next(err)
        })
    
        stream.on('finish', () => {
            req.file.cloudStorageObject = gcsname;
            req.file.cloudStoragePublicUrl = getPublicUrlWebAsset(gcsname);
            next();
        })
    
        stream.end(resizedImageBuffer);
    });
}
exports.uploadToGcsInvoiceAsset = (req, res, next) => {
    if (!req.file) return next();

    const gcsname = Date.now() + req.file.mimetype + req.file.orginalname;
    const file = bucket.file('web-asset/' + gcsname);

    sharp(req.file.buffer)
    .resize(400, 400)
    .toBuffer()
    .then( resizedImageBuffer => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
    
        stream.on('error', (err) => {
            req.file.cloudStorageError = err
            console.log(err);
            next(err)
        })
    
        stream.on('finish', () => {
            req.file.cloudStorageObject = gcsname;
            req.file.cloudStoragePublicUrl = getPublicUrlInvoiceAsset(gcsname);
            next();
        })
    
        stream.end(resizedImageBuffer);
    });

}

exports.editToGcsWebAsset = (req, res, next) => {
    let publicUrl = req.body.publicUrl;
    let publicUrlSplit = publicUrl.split('/');

    const fileName = publicUrlSplit[publicUrlSplit.length - 1];
    const destination = req.body.destination;

    // Blok ini akan menghapus file
    if(destination == 'Web Asset'){
        const file = bucket.file('web-asset/' + fileName);
        file.delete()
        .then( () => {
            req.succesDelete = true;
        })
        .catch( err => {
            req.succesDelete = false;
        })
    } else {
        const file = bucket.file('invoice-asset/' + fileName);
        file.delete()
        .then( () => {
            req.succesDelete = true;
        })
        .catch( err => {
            req.succesDelete = false;
        })
    }

    // Blok ini akan mengupload gambar baru
    if (!req.file) return next();
    const gcsname = Date.now() + '.' + req.file.mimetype.split('/')[1];
    const file = bucket.file('web-asset/' + gcsname);

    sharp(req.file.buffer)
    .resize(400, 400)
    .toBuffer()
    .then( resizedImageBuffer => {
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
    
        stream.on('error', (err) => {
            req.file.cloudStorageError = err
            console.log(err);
            next(err)
        })
    
        stream.on('finish', () => {
            req.file.cloudStorageObject = gcsname;
            req.file.cloudStoragePublicUrl = getPublicUrlWebAsset(gcsname);
            next();
        })
    
        stream.end(resizedImageBuffer);
    });
}

exports.deleteToGcsWebAsset = async (req, res, next) => {    
    let publicUrl = req.body.publicUrl;
    let publicUrlSplit = publicUrl.split('/');
    
    const fileName = publicUrlSplit[publicUrlSplit.length - 1];
    const destination = req.body.destination;
    // console.log(destination, fileName)
    if(destination == 'Web Asset'){
        const file = bucket.file('web-asset/' + fileName);
        await file.delete()
        .then( () => {
            req.succesDelete = true;
        })
        .catch( err => {
            req.succesDelete = false;
        })
    } else {
        const file = bucket.file('invoice-asset/' + fileName);
        await file.delete()
        .then( () => {
            req.succesDelete = true;
        })
        .catch( err => {
            req.succesDelete = false;
        })
    }
    next();
}


