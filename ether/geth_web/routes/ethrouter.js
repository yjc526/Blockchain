var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

var router = express.Router();



// http://localhost:3000/eth/
router.get('/', async function (req, res, next) {
  console.log("=================");
  let blockNumber = await web3.eth.getBlockNumber();

  let blockList = [];

  for (let i = 0; i < blockNumber; i++) {
    let block = await web3.eth.getBlock(i);
    console.log(block);
    blockList.push(block);

  }
  res.render('blockchain', { blocks: blockList, title: "blockchain", selectedIdx: 0 });
});

router.get('/test', function (req, res, next) {
  web3.eth.getBlockNumber()
    .then(number => {
      console.log(number);
      res.json(number);
    })
})



router.get('/block/:idx', async function (req, res, next) {
  const selectedIdx = req.params.idx;
  console.log("selectedIdx = ", selectedIdx);

  let blockNumber = await web3.eth.getBlockNumber();

  let blockList = [];

  for (let i = 0; i < blockNumber; i++) {
    let block = await web3.eth.getBlock(i);
    console.log(block);
    blockList.push(block);
  }

  let targetBlock = blockList[selectedIdx];
  let txCount = targetBlock.transactions.length;
  let txs = [];

  // console.log(targetBlock);
  // console.log(await web3.eth.getTransaction(targetBlock.transactions[0]))

  for (let i = 0; i < txCount; i++) {
    let txId = targetBlock.transactions[i];
    let tx = await web3.eth.getTransaction(txId);
    txs.push(tx);

  }

  res.render('blockchain',
    {
      title: "Blockchain info"
      , blocks: blockList
      , selectedIdx: selectedIdx
      , txs: txs
    }
  )
});


router.get('/wallet/:address', async function (req, res, next) {
  const address = req.params.address;
  const balance = parseInt(await web3.eth.getBalance(address));

  let blockNumber = await web3.eth.getBlockNumber();
  let txsList = [];

  for (let i = 0; i < blockNumber; i++) {
    let block = await web3.eth.getBlock(i);
    let txCount = block.transactions.length;

    for (let j = 0; j < txCount; j++) {
      let tx = await web3.eth.getTransaction(block.transactions[j]);
      if (tx.from == address || tx.to == address) {
        txsList.push([i, tx]);
      }
    }
  }

  res.render('wallet',
    {
      address: address,
      balance: balance,
      txs: txsList
    }
  )
});








router.get('/accountlist', function (req, res, next) {
  web3.eth.getAccounts()
    .then(async accounts => {
      let accountList = [];
      for (let i = 0; i < accounts.length; i++) {
        await web3.eth.getBalance(accounts[i])
          .then(bal => {
            accountList.push({
              WalletAddress: accounts[i],
              balance: bal

            })

          })

      }
      res.render('accountlist', { accounts: accountList })
    })

})

router.get('/createaccount', function (req, res, next) {

  web3.eth.personal.newAccount("eth")
    .then(() => {
      res.redirect('/eth/accountlist');
    })
    .catch(() => {
      console.log("ERR:create account errer");
      res.redirect('/eth/accountlist');
    })

  /* const newKey = ec.genKeyPair();
 const newAccount = {
   "PrivKey" : newKey.getPrivate('hex'),
   "PublicKey" : newKey.getPublic('hex'),
   "WalletAddress" : newKey.getPublic('hex')
 }
 
 mychain.accounts.push(newAccount);

 mychain.saveKeyStore();
 
 res.redirect('/blockchain/accountlist'); */
});





router.get('/createtx', function (req, res, next) {
  web3.eth.getCoinbase().then((wallet) => {
    console.log("wallet : ", wallet);

    res.render('createtx', { wallet: wallet });
  });
});

router.post('/createtx', function (req, res, next) {
  const fromAddress = req.body.fromAddress;
  const toAddress = req.body.toAddress;
  const amount = web3.utils.toHex(req.body.amount);

  console.log('fromAddress : ', fromAddress);
  console.log('toAddress : ', toAddress);
  console.log('amount : ', amount);

  const keystore = { "address": "34c61f35a6e113a5f6a31702d805d21d2d88220f", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "1e63df2ef533ad8b703c5f6676833d4f5cb5f4ffbee92cee20d76e608e19d109", "cipherparams": { "iv": "497761fff6f389dc227c5296b8409d52" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 262144, "p": 1, "r": 8, "salt": "08fac3228aad482a141d273b4f9580a5d82cbd9617d24017106b0076ba92dea8" }, "mac": "d1b59bb5af84357b635f68af961db6a565134ebc70b6120490eeedab64e5fbd3" }, "id": "99668e13-23ac-4c3e-8b30-a880ae464ce6", "version": 3 }
  const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth');
  console.log("privateKey = ", decryptAccount.privateKey);

  async function sendTransaction(fromAddress, toAddress, amount) {
    var txPrams = {
      from: fromAddress,
      to: toAddress,
      value: amount,
      gas: web3.utils.toHex(0x40000)
    }

    var signedTx = await decryptAccount.signTransaction(txPrams);
    console.log("signedTx : ", signedTx);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction).once('transactionHash', (hash) => {
      console.log("hash : ", hash);
    }).catch((err) => {
      console.log("sendSignedTransaction : ", err);
    });
  };

  sendTransaction(fromAddress, toAddress, amount);
  res.redirect('/eth/pendingtransaction');

});

router.get('/pendingtransaction', function (req, res, next) {
  let txs = web3.eth.pendingTransactions;
  res.render('pendingtransaction', { txs: txs });
});

router.get('/miningblock', function (req, res, next) {
  console.log('mining...');
  mychain.minePendingTransactions(wallet1);
  console.log('block mined...');
  res.redirect('/blockchain');
})


router.get('/blockchain_setting', function (req, res, next) {
  res.render('blockchain_setting');
})

router.post('/blockchain_setting', function (req, res, next) {
  const difficulty = parseInt(req.body.difficulty);
  const reward = parseInt(req.body.reward);

  console.log(difficulty);
  console.log(reward);
  mychain.difficulty = difficulty;
  mychain.miningReward = reward;
  console.log(mychain);
  res.redirect('/blockchain');
})

module.exports = router;

