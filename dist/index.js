'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _fs = require('fs');

var _async = require('async');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pandoc = require('simple-pandoc');

function generateOutput(_ref, callback) {
  var story = _ref.story,
      template = _ref.template,
      contextualizers = _ref.contextualizers,
      locale = _ref.locale,
      _ref$outputDirPath = _ref.outputDirPath,
      outputDirPath = _ref$outputDirPath === undefined ? './output' : _ref$outputDirPath,
      _ref$tempDirPath = _ref.tempDirPath,
      tempDirPath = _ref$tempDirPath === undefined ? './temp' : _ref$tempDirPath,
      _ref$format = _ref.format,
      format = _ref$format === undefined ? 'md' : _ref$format;

  var id = story.id;
  (0, _async.waterfall)([function (cb) {
    var Component = template.component;
    var str = _server2.default.renderToStaticMarkup(_react2.default.createElement(Component, {
      locale: locale,
      contextualizers: contextualizers,
      story: story
    }));
    cb(null, str);
  }, function (html, cb) {
    (0, _fs.writeFile)(tempDirPath + '/' + id + '.html', html, function (err) {
      return cb(err, html);
    });
  }, function (html, cb) {
    console.log('converting to ', format);
    var converter = pandoc('html', format);
    var inputPath = tempDirPath + '/' + id + '.html';
    var outputPath = outputDirPath + '/' + id + '.' + format;
    var inputStream = (0, _fs.createReadStream)(inputPath);
    var outputStream = (0, _fs.createWriteStream)(outputPath);
    var stream = converter.stream(inputStream).pipe(outputStream);
    console.log('stream is launched');
    stream.on('error', function (error) {
      cb(error);
    });

    stream.on('finish', function () {
      cb(null);
    });
    // converter(html) 
    // .then(md => {
    //   console.log(md.toString());
    // });
  }], function (err, html) {
    if (!err) {
      console.log('done without error');
    } else {
      console.error('error during rendering : ', err);
    }
    callback(err);
  });
}

module.exports = generateOutput;
