const router = require('express').Router();
const { protect } = require('../controller/verify');
const {
  upload,
  uploadFile,
  getFileList,
  getFile,
  dowloadFile,
  updateFile,
  deleteFile,
} = require('./../controller/file');
router.route('/upload').post(protect, upload.single('file'), uploadFile);
router.route('/list').get(protect, getFileList);
router.route('/delete/:id').delete(protect, deleteFile);
router.route('/download/:id').get(protect, dowloadFile);
router.route('/update/:id').put(protect, upload.single('file'), updateFile);
router.route('/:id').get(protect, getFile);

module.exports = router;
