const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const configuracion = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(configuracion, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts"
});