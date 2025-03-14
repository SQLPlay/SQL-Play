const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withNativeWind} = require('nativewind/metro');
const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;
const nonSvgAssetExts = assetExts.filter(ext => ext !== 'svg');
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    experimentalImportSupport: false,
    inlineRequires: true,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },

  resolver: {
    assetExts: [...nonSvgAssetExts, 'md'],
    sourceExts: [...sourceExts, 'svg'],
  },
};
const mergedConfig = mergeConfig(defaultConfig, config);

module.exports = withNativeWind(mergedConfig, {input: './global.css'});
