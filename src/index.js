import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {writeFile, createReadStream, createWriteStream} from 'fs';
import {waterfall} from 'async';
const pandoc = require('simple-pandoc');

function generateOutput ({
  story,
  template,
  contextualizers,
  locale,
  outputDirPath = './output',
  tempDirPath = './temp',
  format = 'md',
}, callback) {
  const id = story.id;
  waterfall([
    (cb) => {
      const Component = template.component;
      const str = ReactDOMServer.renderToStaticMarkup(
        <Component 
          locale={locale} 
          contextualizers={contextualizers} 
          story={story} 
        />
      );
      cb(null, str);
    },
    (html, cb) => {
      writeFile(`${tempDirPath}/${id}.html`, html, (err) => cb(err, html))
    },
    (html, cb) => {
      console.log('converting to ', format);
      const converter = pandoc('html', format);
      const inputPath = `${tempDirPath}/${id}.html`;
      const outputPath = `${outputDirPath}/${id}.${format}`;
      const inputStream = createReadStream(inputPath);
      const outputStream = createWriteStream(outputPath);
      const stream = converter.stream(inputStream).pipe(outputStream);
      console.log('stream is launched');
      stream.on('error', error => {
        cb(error);
      })

      stream.on('finish', () => {
        cb(null);
      })
      // converter(html) 
      // .then(md => {
      //   console.log(md.toString());
      // });
    }
  ], (err, html) => {
    if (!err) {
      console.log('done without error');
    } else {
      console.error('error during rendering : ', err);
    }
    callback(err);
  })
}

module.exports = generateOutput;