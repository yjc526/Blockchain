const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, transactions, prevHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.nonce = 0;
        this.transactions = transactions;

        this.curHash = this.calculateHash();

    }

    // 해시 값 생성
    calculateHash() {
        return SHA256(this.prevHash
            + this.timestamp
            + this.nonce
            + JSON.stringify(this.transactions)).toString();
    }

    // 블록 출력
    printBlock() {
        console.log(JSON.stringify(this, null, 2));
    }

    // 채굴
    miningBlock(difficulty) {
        while (this.curHash.substring(0, difficulty) !==
            Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.curHash = this.calculateHash();
            //console.log("mining...", this.nonce, "...", this.curHash);
        }
    }

    // block 을 검증하는 부분
    hasValidTransaction() {
        for (let tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }

}

module.exports = Block;