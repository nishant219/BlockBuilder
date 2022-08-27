const express = require("express");
const sha256 = require("sha256");
const bodyParser = require('body-parser');
const hbs = require('hbs');

const app = express();
const port = 3000;

//create block conyaining (nonce, data, previous block's hash)
class Block {
  constructor(index, data, prevHash) {
    this.index = index;  //nonce 8191
    this.timestamp = Date.now();
    this.data = data;
    this.prevHash = prevHash;
    this.currHash = this.mineBlock();
  }

  //simple pow algo
  mineBlock() {
    var nonce = 0;
    var hash = "";
    while (!this.verifyHash(hash)) {
      hash = sha256(nonce + this.data);
      nonce += 1;
    }
    return hash;
  }

//to verify hash we are checking wheteher hash starting with 3 zeros or not
  verifyHash(hash){
    return (hash.startsWith("0"*3));
  }

}

//created blockchain here
class Blockchain{
    constructor(){
        console.log("blockchain class initiated");
        this.blockchain=[this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0,"data in the genesis block", '0');
    }
    addNewBlock(data){
        var block = new Block(this.getLastBlockindex() + 1, data, this.getLastBlockHash());
        this.blockchain.push(block);
    }
    getLastBlockindex(){
        return this.blockchain.at(-1).index;
    }
    getLastBlockHash(){
        return this.blockchain.at(-1).currHash;
    }
}

//chain code goes here //create chain of blocks
var blockchain = new Blockchain();
blockchain.addNewBlock('first block');
blockchain.addNewBlock('second block');
//console.log(chain);


// parse application/json
app.use(bodyParser.json({ type: '*' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set("views", __dirname); //set views dir to curr dir


app.get('/', (req, res) => {
	res.render('index', {blockchain: blockchain.blockchain})
});

app.post("/", (req, res) => {
    console.log(req.body)
    blockchain.addNewBlock(req.body.data)
    res.render('index', {blockchain: blockchain.blockchain})
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
