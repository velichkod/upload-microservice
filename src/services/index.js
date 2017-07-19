const packageJson = require('../../package.json');
const { serverStatus } = require('node-helpers');
const upload = require('./upload/file-upload');
const removeFile = require('./remove/file-remove');
const fileUpload = require('express-fileupload');
const filesToBody = require('../middleware/files-to-body');


module.exports = function () {
  const app = this;

  app.service('/', { find: serverStatus(packageJson) });

  app.use(fileUpload());
  app.use(filesToBody);

  app.service('/s3/upload', { create: upload });
  app.service('/s3/remove', { remove: removeFile });

};