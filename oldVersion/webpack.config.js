const path = require('path');
module.exports = {
  context: __dirname,
  entry: './js/game.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  
  devtool: 'source-maps'
};
