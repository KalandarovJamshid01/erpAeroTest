const router = require('express').Router();
const { upload, uploadFile } = require('./../controller/file');

router.route('/upload').post(upload.single('file'), uploadFile);
router.route('/list').get();
router.route('/delete/:id').delete();
router.route('/download/:id').get();
router.route('/update/:id').put();
router.route('/:id').get();

module.exports = router;
