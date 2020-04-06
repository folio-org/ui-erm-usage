import 'babel-polyfill';

// require all modules ending in "-test" from the current directory and
// all subdirectories
const requireTest = require.context('./tests/', true, /details-udp-test/);
requireTest.keys().forEach(requireTest);
