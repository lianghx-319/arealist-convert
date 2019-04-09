const path = require("path")

module.exports = function(dirName) {
  return function (filename) {
    return path.join(__dirname, dirName, filename)
  }
}