var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const SHA256=require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
        this.signature = undefined;

    }

    // 트랜잭션 출력
    printTransaction(){
        console.log(JSON.stringify(this,null,2));
    }

    //  유효한 트랜잭션인지 검사
    isValid() {
        // signature 가 있는지 검사
        if(!this.signature || this.signature.length === 0) {
            console.log('Warn : No, Singature');
            return false;
        }

        // 정상적으로 sign 되어있는지 검사
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

    calculateHash(){
        return SHA256(this.fromAddress
                    + this.toAddress
                    + this.amount).toString();
    }

    // 트랜잭션 서명
    signTransaction(privkey) {
        if(privkey.getPublic('hex') !== this.fromAddress) {
            console.log("ERR : NO, Permission");
            return false;
        }
        const hashTx = this.calculateHash();
        const sig = privkey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
        return true;
    }
}
module.exports=Transaction;