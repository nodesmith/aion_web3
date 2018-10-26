const scriptDir = process.argv[3];
const Web3 = require(`./${scriptDir}/../packages/web3`);

const endpoint = process.argv[2];
console.log(`Creating connection to ${endpoint}`);

const web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
console.log(`web3 object defined. Enter command into the REPL (Use await to get the result)`);
