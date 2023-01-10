const {assert} = require('chai');
const KryptoBird = artifacts.require('./KryptoBird');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('KryptoBird',(account)=>{
    let contract;
    before(async()=>{
        contract = await KryptoBird.deployed()
    })
    describe('deployment',async()=>{
        it('deploys successfully',async()=>{
            const address = contract.address;
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
            assert.notEqual(address,0x0)
        })
        it("valid name",async()=>{
            const name= await contract.name()
            assert.equal(name,'KryptoBird')
        })
        it("valid symbol",async()=>{
            const symbol= await contract.symbol()
            assert.equal(symbol,'KBIRDZ')
        })
    })
    describe('minting',async()=>{
        it('creates a new token',async()=>{
            const result= await contract.mint("https...1")
            const totalSupply=await contract.totalSupply()
            assert.equal(totalSupply,1)
            const event=result.logs[0].args
            assert.equal(event.from,'0x0000000000000000000000000000000000000000','from is the contract')
            assert.equal(event.to,account[0],'to is msg.sender')
            await contract.mint("https...1").should.be.rejected;
            //assert.equal('1',contract.kryptoBirdz(0),"first mint is valid") //Push not happening as expected
        })
    }) 
    describe('indexing',async()=>{
        it('lists KryptoBirdz', async() => {
            // Mint three new tokens
            await contract.mint('https...2')
            await contract.mint('https...3')
            await contract.mint('https...4')
            const totalSupply = await contract.totalSupply()
            // Loop through list and grab KBirdz from list
            let result = []
            let KryptoBird
            for(i = 1; i <= totalSupply; i++) {
                KryptoBird = await contract.kryptoBirdz(i - 1)
                result.push(KryptoBird)
            }
        })
    })
})