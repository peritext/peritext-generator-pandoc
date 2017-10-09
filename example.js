const path = require('path');
const generate = require('./dist/index');
const template = require('peritext-template-codex-garlic');
const story = require('./examples/story');
const exampleLocale = require('./example-locale');
const waterfall = require('async').waterfall;

const contextualizers = {
  bib: require('peritext-contextualizer-bib'),
  codefiles: require('peritext-contextualizer-codefiles'),
  vegalite: require('peritext-contextualizer-vegalite'),
  p5: require('peritext-contextualizer-p5'),
  glossary: require('peritext-contextualizer-glossary'),
  video: require('peritext-contextualizer-video'),
  embed: require('peritext-contextualizer-embed'),
  image: require('peritext-contextualizer-image'),
  table: require('peritext-contextualizer-table'),
  dicto: require('peritext-contextualizer-dicto'),
  webpage: require('peritext-contextualizer-webpage'),
  'data-presentation': require('peritext-contextualizer-data-presentation'),
};

waterfall([
  latex => 
    generate({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples'),
      format:'latex',
    }, latex),
  icml => 
    generate({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples'),
      format:'icml',
    }, icml),
  markdown => 
    generate({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples'),
      format:'markdown',
    }, markdown),
  docx => 
    generate({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples'),
      format:'docx',
    }, docx),
  odt => 
    generate({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples'),
      format:'odt',
    }, odt),
  tei => 
    generate({
      story: story,
      contextualizers,
      template: template,
      locale: exampleLocale,
      tempDirPath: path.resolve(__dirname + '/temp'),
      outputDirPath: path.resolve(__dirname + '/examples'),
      format:'tei',
    }, tei),
], err => console.log('all done'))