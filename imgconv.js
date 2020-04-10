const sharp = require('sharp');
const fs = require('fs');
const R = require('ramda');

const IMG_DIR = './ignore_data/ELD';
const getPath = (x) => IMG_DIR + '/' + x;
const images = ['Seasonal Ritual.full.jpg']; //fs.readdirSync('./ignore_data/ELD');
const firstImage = getPath(R.head(images));
console.log(firstImage);
const sharpedImg = sharp(firstImage);

const convert = (sharpedImg, filename) =>
    sharpedImg.metadata()
        .then((metadata) => sharpedImg.resize(Math.round(metadata.width / 2.5)).jpeg().toFile(`./ignore_data/ELD2/${filename}`));

images.forEach((filename) => {
    const newFilename = R.pipe(R.replace("'", ' '), R.replace(",", ' '), R.replace("full.", ''))(filename);
    convert(sharp(getPath(filename)), newFilename);
})