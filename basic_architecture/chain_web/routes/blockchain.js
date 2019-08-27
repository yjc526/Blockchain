var express = require('express');
var router = express.Router();
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
 
const Transaction = require('./mychain/transaction');
const Blockchain = require('./mychain/blockchain');
 
 
const userKeyStr1 = 'cdcee708bee2cb30b67ed2524cb6bd370bf516a94ee452b65c704dae155771a5';
const userKeyStr2 = '6c16bbb6424b8f763cd1d872229f68e62372afacfb1697997afbfae774dfcc90';
 
const privKey1 = ec.keyFromPrivate(userKeyStr1);
const privKey2 = ec.keyFromPrivate(userKeyStr2);
 
const wallet1 = privKey1.getPublic('hex');
const wallet2 = privKey2.getPublic('hex');
 
const mychain = new Blockchain();
 
const tx1 = new Transaction (wallet1, wallet2, 100);
const signTx1 = tx1.signTransaction(privKey1);
 
mychain.addTransaction(tx1);
 
const tx2 = new Transaction (wallet1, wallet2, 10);
const signTx2 = tx2.signTransaction(privKey1);
 
mychain.addTransaction(tx2);
 
mychain.minePendingTransactions(wallet1);
 
const tx3 = new Transaction (wallet2, wallet1, 20);
const signTx3 = tx3.signTransaction(privKey2);
 
mychain.addTransaction(tx2);
 
mychain.minePendingTransactions(wallet1);
 
mychain.printBlockchain();
 
/* GET home page. */
/* url : /blockchain */
router.get('/', function(req, res, next) {
 res.render('blockchain', {blocks: mychain.chain, title:"blockchain", selectedIdx: 0});
});
 
 
router.get('/block/:idx', function(req, res, next) {
 const selectedIdx = req.params.idx;
 
 res.render('blockchain',
      {title: "Blockchain info"
      , blocks: mychain.chain
      , selectedIdx : selectedIdx
      , txs : mychain.chain[selectedIdx].transactions}
 )
});
 
router.get('/createtx', function (req, res, next) {
 res.render('createtx', {wallet : wallet1});
})
 
router.post('/createtx', function (req, res, next) {
 const fromAddress = req.body.fromAddress;
 const toAddress = req.body.toAddress;
 const amount = req.body.amount;
 
 console.log('fromAddress : ', fromAddress);
 console.log('toAddress : ', toAddress);
 console.log('amount : ', amount);
 
 const tx = new Transaction(fromAddress, toAddress, amount);
 tx.signTransaction(privKey1);
 mychain.addTransaction(tx);
 
 console.log(mychain.pendingTransactions);
 res.redirect('/blockchain/pendingtransaction');
 })

 router.get('/pendingtransaction', function (req, res, next) {
   let txs=mychain.pendingTransactions
  res.render('pendingtransaction', {txs : txs});
 })


 router.get('/miningblock', function (req, res, next) {
     mychain.minePendingTransactions(wallet1);
     console.log('blocked mined...');
     res.redirect('/blockchain');
 })
 
module.exports = router;
