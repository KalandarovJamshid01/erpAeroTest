const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const catchErrorAsync = require('../util/catchError');
const db = require('./../model/index');
const responseFunction = require('./../util/response');
const AppError = require('../util/AppError');
const file = require('../model/file');
const files = db.files;
const queryFunction = (req) => {
  let paramQuerySQL = {};
  let sort = req.query?.sort || '';
  let page = req.query?.page || 1;
  let limit = req.query?.limit || 10;
  let offset;

  // sorting
  if (sort !== '' && typeof sort !== 'undefined') {
    let query;
    if (sort.charAt(0) !== '-') {
      query = [[sort, 'ASC']];
    } else {
      query = [[sort.replace('-', ''), 'DESC']];
    }
    paramQuerySQL.order = query;
  }

  // pagination
  if (limit) {
    offset = page * limit - limit;
    paramQuerySQL.offset = offset;
    paramQuerySQL.limit = limit * 1;
  }
  return paramQuerySQL;
};

const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      file.originalname = Buffer.from(file.originalname, 'latin1')
        .toString('utf8')
        .replaceAll(' ', '_');
      const generateName = uuidv4() + '-' + file.originalname;
      cb(null, generateName);
    },
  }),
  // Limits can be added here if needed
});
function getExtension(fileName) {
  return fileName.split('.').pop();
}
const uploadFile = catchErrorAsync(async (req, res, next) => {
  // Assuming a single file upload field named 'file'

  // Access uploaded file information from req.file
  const { filename, originalname, mimetype, size } = req.file;

  const newFile = await files.create({
    fileName: filename,
    fileExtension: getExtension(originalname),
    fileMimeType: mimetype,
    fileSize: size / 1024 / 1024,
    userId: req.user.id,
  });

  if (req.file && newFile) {
    return responseFunction(req, res, 201, newFile);
  }

  return next(new AppError("File isn't uploaded", 404));
});

const getFileList = catchErrorAsync(async (req, res, next) => {
  const query = queryFunction(req);
  const data = await files.findAll({
    where: { userId: req.user.id },
    ...query,
  });
  const count = await files.count({ where: { userId: req.user.id } });

  responseFunction(req, res, 200, data, count);
});
const checkFunction = (req, res, next, data) => {
  if (req.user.id !== data.userId) {
    return next(new AppError('This information does not belong to you', 403));
  }
};
const getFile = catchErrorAsync(async (req, res, next) => {
  const data = await files.findOne({
    where: {
      id: req.params.id,
    },
  });

  checkFunction(req, res, next, data);

  responseFunction(req, res, 200, data);
});
const dowloadFile = catchErrorAsync(async (req, res, next) => {
  const data = await files.findOne({ where: { id: req.params.id } });

  checkFunction(req, res, next, data);

  const filePath = path.join(__dirname, '../uploads', data.fileName);
  res.download(filePath);
});

const updateFile = catchErrorAsync(async (req, res, next) => {
  const data = await files.findOne({ where: { id: req.params.id } });
  checkFunction(req, res, next, data);
  const filePath = path.join(__dirname, '../uploads', data.fileName);
  fs.unlinkSync(filePath);

  const { filename, originalname, mimetype, size } = req.file;
  data.id = data.id;
  data.fileName = filename;
  data.fileExtension = getExtension(originalname);
  data.fileMimeType = mimetype;
  data.fileSize = size / 1024 / 1024;
  data.userId = req.user.id;
  await data.save();
  responseFunction(req, res, 203, data);
});
const deleteFile = catchErrorAsync(async (req, res, next) => {
  const data = await files.findOne({ where: { id: req.params.id } });
  checkFunction(req, res, next, data);
  data.destroy();
  responseFunction(req, res, 204, data);
});
module.exports = {
  uploadFile,
  upload,
  getFileList,
  getFile,
  dowloadFile,
  updateFile,
  deleteFile,
};
