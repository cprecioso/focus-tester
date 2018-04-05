module.exports = require("@zeit/next-typescript")({
  exportPathMap: function(defaultPathMap) {
    return {
      "/": { page: "/" }
    }
  }
})
