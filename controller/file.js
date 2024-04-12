const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const catchErrorAsync = require('../util/catchError');
const db = require('./../model/index');
const responseFunction = require('./../util/response');
const AppError = require('../util/AppError');
const files = db.files;
// ... other code

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

const uploadFile = catchErrorAsync(async (req, res, next) => {
  // Assuming a single file upload field named 'file'

  function getExtension(fileName) {
    return fileName.split('.').pop();
  }
  // Access uploaded file information from req.file
  const { filename, originalname, mimetype, size } = req.file;

  const newFile = await files.create({
    fileName: filename,
    fileExtension: getExtension(originalname), 
    fileMimeType: mimetype,
    fileSize: size / 1024 / 1024, // Convert size to MB (optional)
  });


  if (req.file && newFile) {
    return responseFunction(req, res, 201, newFile);
  }

  return next(new AppError("File isn't uploaded", 404));
});

module.exports = { uploadFile, upload };
