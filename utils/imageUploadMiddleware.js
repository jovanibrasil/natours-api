const multer = require('multer');
const AppError = require('./AppError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images!'));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = ({ type = 'single', fieldName, fields } = {}) => {
  if (type === 'single') return upload.single(fieldName);

  return upload.fields(fields);
};
