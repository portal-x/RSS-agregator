const path = require('path');

module.exports = {
  entry: './src/js/bin/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
}