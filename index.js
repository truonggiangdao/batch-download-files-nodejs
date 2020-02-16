const http = require('http');
const https = require('https');
const fs = require('fs');

// const list = require('./finInfo-annual-vn.json');
// const list = require('./finInfo-earnings-en.json');
// const list = require('./finInfo-earnings-vn.json');
// const list = require('./finInfo-quater-en.json');
const list = require('./finInfo-quater-vn.json');

const getFolderReady = (path) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path, 0744);
  }
}

const dateTime = new Date().toISOString();
var outputDir = `./files/${dateTime}`;
getFolderReady(outputDir);
const results = {
  success: 0,
  fail: 0,
  total: list.length,
};

const fileResults = {
  success: [],
  fail: [],
};

const getFileName = (name) => name.substr(0, 50);

const downloadFile = (folder, name, url) => (
  new Promise((resolve, reject) => {
    const folderPath = `${outputDir}/${folder}`;
    getFolderReady(folderPath);
    const dest = `${folderPath}/${name}`;
    const file = fs.createWriteStream(dest);
    const downloader = url.indexOf('https') === 0 ? https : http;
    downloader.get(url, function(response) {
      response.pipe(file);
      // var len = parseInt(response.headers['content-length'], 10);
      // var downloaded = 0;
      // response
      // .on('data', function(chunk) {
      //   downloaded += chunk.length;
      //   console.log(getFileName(name) + " - Downloading " + (100.0 * downloaded / len).toFixed(2) + "%");
      // }).on('end', function () {
      // })
      // .on('error', function (err) {
      //   console.log(getFileName(name) + ':' + err.message);
      // });
      file
      .on('finish', function() {
        file.close(() => true);
        resolve(file);
        results.success += 1;
        console.log(`Downloaded ${name}, cur: ${JSON.stringify(results)}`);
      })
      .on('error', function (err) {
        console.log(getFileName(name) + ':' + err.message);
        // fileResults.fail.push(name);
        results.fail += 1;
        console.log(`Failed to save ${name}, cur: ${JSON.stringify(results)}`);
      });
    }).on('error', function(err) {
      fs.unlink(dest, () => {});
      reject(`ERR: ${name}: ${err.message}`);
      // fileResults.fail.push(name);
      results.fail += 1;
      console.log(`Failed to download ${name}, cur: ${JSON.stringify(results)}`);
    });
  })
);

const downloadChunk = (chunks = [], count = 0) => (
  new Promise((resolve, reject) => {
    Promise.all(chunks)
    .then(() => {
      console.log('Downloaded ' + chunks.length + ' files of chunk ' + count);
      resolve();
    })
    .catch(err => {
      console.log(err);
      reject();
    });
  })
);

// const downloadFiles = async (data = [], chunkCount = 1) => {
//   var count = 0;
//   var reqs = [];
//   while (data.length > 0) {
//     count++;
//     reqs = data.splice(0, chunkCount).map((record) =>
//       downloadFile(record.folder, record.name, record.url)
//       .then(() => {})
//       .catch(err => {console.log(err)})
//     );
//     console.log('Download', data.length, reqs.length);
//     try {
//       await downloadChunk(reqs, count);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };

const downloadFiles = async (data = [], chunkCount = 1) => {
  var count = 0;
  var reqs = [];
  while (count < data.length) {
    const record = data[count];
    count++;
    console.log('Download', data.length, count);
    try {
      await downloadFile(record.folder, record.name, record.url);
    } catch (error) {
      console.log(error);
    }
  }
};

downloadFiles(list, 10);
