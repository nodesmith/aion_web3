if (process.argv.length !== 4) {
  console.error('Wrong number of parameters.');
  console.error('Usage: node smoketest.js <endpoint> <mainnet|testnet>');
  return -1;
}

const endpoint = process.argv[2];
const network = process.argv[3];

console.log(`Testing network ${network} via endpoint ${endpoint}\n`);

const Web3 = require('../packages/web3');
const web3 = new Web3(new Web3.providers.HttpProvider(endpoint));

const networkData = {
  mainnet: {
    blockNumber: 1520987
  },
  testnet: {
    blockNumber: 801909
  }
};

const data = networkData[network];

const doTest = async (description, fn, validator) => {
  console.log('---------------------------');
  console.log(`Testing ${description}`);
  const result = await fn();
  console.log(`Result was ${JSON.stringify(result)}`);
  if (validator && !validator(result)) {
    console.error('Error during validation. Exiting');
    throw new Error(`Error during validation`);
  }
  console.log('---------------------------\n');
}

// Wrap in async anonymous function so we can use await
(async () => {

  const signedAccount = web3.eth.accounts.privateKeyToAccount('0xc4eb686cc8219279a162c0b0bb83f8bdcf7d8b9375e29dad7efef9eae7c45cd49a51bc083cc4c091ffe2b0568b721b7cf31c572e7b64d2d7e41d11fa5ae4fe51');
  const transaction = { 
    to:'0xa07e7426030da23829eb418a458a72ede1a6dbacac38ca0c76456bd94c600af6',
    value: 8,
    gas: '0x4A817C800',
    gasPrice: 2000000,
    data: '',
    // timestamp: 1540572065028000,
    type: 1
  };

  const signedTx = await signedAccount.signTransaction(transaction);
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(txReceipt);

  /*
  requests.put("web3_clientVersion", Arrays.asList());
        requests.put("eth_hashrate", Arrays.asList());
        requests.put("eth_syncing", Arrays.asList());
        requests.put("net_listening", Arrays.asList());
        requests.put("net_peerCount", Arrays.asList());
        requests.put("net_version", Arrays.asList());
        requests.put("eth_accounts", Arrays.asList());
        requests.put("eth_protocolVersion", Arrays.asList());
        requests.put("eth_getCompilers", Arrays.asList());
        requests.put("eth_mining", Arrays.asList());
        requests.put("eth_submitHashrate", Arrays.asList(
            "0x0000000000000000000000000000000000000000000000000000000000500000",
            "0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c"
        ));
        */

  await doTest('clientVersion', web3.eth.getNodeInfo, (nodeInfo) => nodeInfo.indexOf('Aion') >= 0);
  await doTest('hashRate', web3.eth.getHashRate, (rate) => rate === 0);    
  await doTest('getBlockNumber', web3.eth.getBlockNumber, (blockNumber) => blockNumber > data.blockNumber);


  // console.log('Testing getBlockNumber');
  // const blockNumber = await web3.eth.getBlockNumber();
  // console.log(`Returned block number ${blockNumber}\n`);
  // if (blockNumber < data.blockNumber) {
  //   throw 'Invalid block number returned';
  // }

})();
