import auth from './auth';
import authWx from './authWx';
import extendRes from './extendRes';
import typeorm from './typeorm';
import logger from './logger';
import proxy from './proxy';

export default { auth, extendRes, typeorm, logger, proxy, authWx };

// const fs = require('fs');
// const curPath = __dirname;

// fs.readdirSync(curPath).forEach((item) => {
//   let filePath = `${curPath}/${item}/index.js`;
//   if (fs.existsSync(filePath)) {
//     exports[item] = require(filePath)
//   }
// })
