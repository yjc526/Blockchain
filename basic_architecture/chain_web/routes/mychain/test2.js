var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const Block = require('./block');
const Transaction = require('./transaction');
const Blockchain = require('./blockchain');

const userKeyStr1 = "e575a66fafff412755d5f7bb9badce0e124e36e3766a9741dbefa04b4094cc55";
const userKeyStr2 = "7c841fdee925f6202c9e5aa2129358bbf160a8f3af02fb57cefa332c5481a39b";

const privkey1 = ec.keyFromPrivate(userKeyStr1);
const privkey2 = ec.keyFromPrivate(userKeyStr2);

const wallet1 = privkey1.getPublic('hex');
const wallet2 = privkey2.getPublic('hex');
 
const tx1 = new Transaction (wallet1, wallet2, 100);
const signTx1 = tx1.signTransaction(privkey1);

const tx2 = new Transaction (wallet1, wallet2, 10);
const signTx2 = tx2.signTransaction(privkey1);

const tx3 = new Transaction (wallet2, wallet1, 20);
const signTx3 = tx3.signTransaction(privkey1);

console.log(tx1.isValid());
console.log(tx2.isValid());
console.log(tx3.isValid());
 
//tx1.printTransaction();
//tx2.printTransaction();
 
 
const mychian = new Blockchain();
 
const newBlock = new Block(1, Date.now(), [tx1]);

console.log(newBlock.hasValidTransaction());

 
const newBlock2 = new Block(2, Date.now(), [tx1, tx2]);

console.log(newBlock2.hasValidTransaction());

const newBlock3 = new Block(2, Date.now(), [tx1, tx2, tx3]);

//console.log(newBlock3.hasValidTransaction());
 
/*
mychian.addBlock(newBlock);
mychian.addBlock(newBlock2);
*/

/* mychian.addBlock(newBlock3);
 
mychian.printBlockchain();
 */