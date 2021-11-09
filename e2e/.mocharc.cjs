module.exports = {
  recursive: true,
  timeout: 120000,
  bail: true,
  files: ['e2e/init.js', 'e2e/2_commandList.js'],
  ui: "bdd"
  // "ignore": ["e2e/runCommand.js"]
};
