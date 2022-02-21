/****************************
 FILE HANDLING OPERATIONS
 ****************************/
let fs = require('fs');
let path = require('path');
const _ = require("lodash");
const mv = require('mv');
const Jimp = require('jimp');

class File {

    constructor(file, location) {
        this.file = file;
        this.location = location;
    }

    // Method to Store file (image)
    store(data) {
        return new Promise((resolve, reject) => {
            if (_.isEmpty(this.file.file)) {
                reject('Please send file.');
            }

            let fileName = this.file.file[0].originalFilename.split(".");
            let ext = _.last(fileName);
            let imagePath, name, fileObject, fileType;
            if (data) {
                let imageExt = ["jpg", "jpeg", "png"];
                let videoExt = ["mp4", "avi", "mov", "mpg", "3gp", "asf"];
                let lowerCaseExt = ext.toLowerCase();
                if (imageExt.includes(lowerCaseExt)) {
                    imagePath = data.imagePath + '/images/';
                    fileType = "image";
                    name = 'image_' + Date.now().toString() + '.' + ext;
                } else if (videoExt.includes(lowerCaseExt)) {
                    imagePath = data.imagePath + 'videos/';
                    fileType = "video";
                    name = 'video_' + Date.now().toString() + '.' + ext;
                }
                fileObject = { "filePath": imagePath + name, "fileType": fileType };
            } else {
                imagePath = data && data.imagePath ? data.imagePath : '/public/upload/images/';
                name = 'image_' + Date.now().toString() + '.' + ext;
                fileObject = { "filePath": name };
            }
            let filePath = imagePath + name;
            mv(this.file.file[0].path, appRoot + filePath, { mkdirp: true }, function (err) {
                if (err) {
                    reject(err);
                }
                if (!err) {
                    resolve({ fileObject, name });
                }
            });
        });

    }

    readFile(filepath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, 'utf-8', (err, html) => {
                if (err) {
                    return reject({ message: err, status: 0 });
                }
                return resolve(html);
            });
        });
    }

    deleteFile() {
        //TODO
        return new Promise((resolve, reject) => {
            try {
                // create unlink functionality from server
            } catch (error) {
                reject(error);
            }
        });
    }

    /****************************************************** 
     image upload code for image compression and image resizing
     scaleToFit(width, height) for resizing the image, set width and height  of the image according to your requirement
     quality(40) for image compression
     If you don't want any of these you can simply remove this.
    **************************************************************/
    saveImage(data) {
        return new Promise(async (resolve, reject) => {
            await Jimp.read(this.file.file[0].path).then(async (image1) => {
                let fileName = this.file.file[0].originalFilename.split(".");
                let ext = _.last(fileName);
                let imagePath = data && data.imagePath ? data.imagePath : '/public/upload/images/';
                let name = 'image_' + Date.now().toString() + '.' + ext;
                let fileObject = { "filePath": name };
                let filePath = appRoot + imagePath + name;
                let createAndStorecImage = await image1.quality(50).scaleToFit(600, 600).write(filePath, async () => {
                    return resolve(fileObject)
                });
            }).catch(err => {
                resolve(JSON.stringify(err))
            });
        });
    }
}

module.exports = File;