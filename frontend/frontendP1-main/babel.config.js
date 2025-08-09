module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/utils': './src/utils',
            '@/types': './types',
            '@/config': './src/config',
            '@/context': './src/context',
            '@/hooks': './src/hooks',
            '@/styles': './src/styles',
          },
        },
      ],
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
