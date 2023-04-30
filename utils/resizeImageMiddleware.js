/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const sharp = require('sharp');

module.exports = ({ fields }) => async (req, _, next) => {
  for (const { name, filenameFunction, size, filepath } of fields) {
    const fieldFiles = req.files[name];
    req.body[name] = [];
    fieldFiles.map((file) => {
      file.filename = filenameFunction(req);

      if (fieldFiles.length > 1) req.body[name].push(file.filename);
      else req.body[name] = file.filename;

      return sharp(file.buffer)
        .resize(size.width, size.height)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${filepath}/${file.filename}`);
    });
  }

  next();
};
