const http = require('http');
const fs = require('fs');

class Downloader {
    constructor(rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    download (filename, setDirectory, url) {
        let setDirectoryFull = `${this.rootDirectory}/${setDirectory}/`;
        console.log(`Download ${filename}`);
        if (!fs.existsSync(setDirectoryFull)) {
            fs.mkdirSync(setDirectoryFull);
        }
        let fileNameFull = `${setDirectoryFull}/${filename}`;
        if (fs.existsSync(fileNameFull)) {
            console.log(`Skip ${fileNameFull}`);
            return;
        }
    
        var file = fs.createWriteStream(fileNameFull);
        var request = http.get(url, function(response) {
            response.pipe(file);
        });
    }
}

exports.Downloader = Downloader;