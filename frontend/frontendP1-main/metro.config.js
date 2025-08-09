const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Add the file extensions you want to support
  'bin'
);

config.resolver.sourceExts.push(
  // Add the file extensions you want to support
  'jsx',
  'js',
  'ts',
  'tsx',
  'json'
);

module.exports = config;
