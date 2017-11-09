const config = require('smart-config').get('local');
const _ = require('lodash');
const Promise = require('bluebird');
const httpError = require('http-errors');
const LocalDb = require('../db/')();
const uuidv4 = require('uuid/v4');
const path = require('path');

module.exports = async ({ input }) => {
  return uploadMany(input);
};

function uploadMany(files) {
  if (_.isArray(files)) {
    return Promise.map(files, (file) => {
      return upload(file);
    });
  }
  return upload(files);
}

function upload(file) {
  return new Promise((resolve, reject) => {
    const tempFilename = getTargetFilename(file.name);
    const tempFullname = getTargetFullname(tempFilename);

    file.mv(tempFullname, (err) => {
      if (err) {
        return reject(httpError(500));
      }
      try {
        const filekey = LocalDb.saveFile(tempFilename);
        const fileurl = config.files_baseurl + filekey;
        resolve({ key: filekey, url: fileurl });
      } catch (err) {
        return reject(httpError(err.statusCode, err.message));
      }
    });
  });
}

function getTargetFullname(filename) {
  return path.join(config.files_path, "/", filename);
}

function getTargetFilename(filename) {
  return "" + uuidv4() + filename;
}
