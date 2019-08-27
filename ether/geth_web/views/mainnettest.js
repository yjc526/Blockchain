var Web3 = require('web3');
var web3 = new Web3('https://mainnet.infura.io');
/* 
 web3.eth.getBlockNumber()
.then(number => {
    console.log(number)
})
 
 web3.eth.getBlock(8430167)
.then(block => {
    console.log(block)
}) */
 console.log("----------------------------")
 web3.eth.getTransaction('0xbb52cbbd90ba25fbefa7101e935fd9aa1c5192a82421c2175b944751b3f013a2')
 .then(txs =>{
     console.log(txs)
 })