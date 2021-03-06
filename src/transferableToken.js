"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const VError = require("verror");
const _ = require("underscore");
const logger = require("config-logger");
class TransferableToken {
    constructor(wsURL, contractOwner, contractAddress, accountPassword = "") {
        this.wsURL = wsURL;
        this.jsonInterface = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "fromAddress", "type": "address" }, { "name": "toAddress", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "toAddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "externalId", "type": "string" }, { "name": "reason", "type": "string" }], "name": "issue", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "holderAddress", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "toAddress", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "redeem", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "ownerAddress", "type": "address" }, { "name": "spenderAddress", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "tokenSymbol", "type": "string" }, { "name": "toeknName", "type": "string" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "toAddress", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "externalId", "type": "string" }, { "indexed": false, "name": "reason", "type": "string" }], "name": "Issue", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "fromAddress", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Redeem", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
        this.binary = '0x60606040526003805460ff1916905560068054600160a060020a03191633600160a060020a0316179055341561003457600080fd5b604051610d45380380610d458339810160405280805182019190602001805190910190505b600182805161006c929160200190610089565b506002818051610080929160200190610089565b505b5050610129565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100ca57805160ff19168380011785556100f7565b828001600101855582156100f7579182015b828111156100f75782518255916020019190600101906100dc565b5b50610104929150610108565b5090565b61012691905b80821115610104576000815560010161010e565b5090565b90565b610c0d806101386000396000f300606060405236156100c25763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100c7578063095ea7b31461015257806318160ddd1461018857806323b872dd146101ad578063313ce567146101e957806364f018d81461021257806366188463146102cd57806370a082311461030357806395d89b4114610334578063a9059cbb146103bf578063d73dd623146103f5578063db006a751461042b578063dd62ed3e14610455575b600080fd5b34156100d257600080fd5b6100da61048c565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101175780820151818401525b6020016100fe565b50505050905090810190601f1680156101445780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015d57600080fd5b610174600160a060020a0360043516602435610535565b604051901515815260200160405180910390f35b341561019357600080fd5b61019b6105dc565b60405190815260200160405180910390f35b34156101b857600080fd5b610174600160a060020a03600435811690602435166044356105e3565b604051901515815260200160405180910390f35b34156101f457600080fd5b6101fc61065d565b60405160ff909116815260200160405180910390f35b341561021d57600080fd5b61017460048035600160a060020a03169060248035919060649060443590810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061066695505050505050565b604051901515815260200160405180910390f35b34156102d857600080fd5b610174600160a060020a0360043516602435610805565b604051901515815260200160405180910390f35b341561030e57600080fd5b61019b600160a060020a03600435166108f5565b60405190815260200160405180910390f35b341561033f57600080fd5b6100da610914565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101175780820151818401525b6020016100fe565b50505050905090810190601f1680156101445780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156103ca57600080fd5b610174600160a060020a03600435166024356109bd565b604051901515815260200160405180910390f35b341561040057600080fd5b610174600160a060020a03600435166024356109d3565b604051901515815260200160405180910390f35b341561043657600080fd5b610174600435610a43565b604051901515815260200160405180910390f35b341561046057600080fd5b61019b600160a060020a0360043581169060243516610b0d565b60405190815260200160405180910390f35b610494610bcf565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561052a5780601f106104ff5761010080835404028352916020019161052a565b820191906000526020600020905b81548152906001019060200180831161050d57829003601f168201915b505050505090505b90565b60008115806105675750600160a060020a03338116600090815260056020908152604080832093871683529290522054155b151561057257600080fd5b600160a060020a03338116600081815260056020908152604080832094881680845294909152908190208590557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259085905190815260200160405180910390a35060015b92915050565b6000545b90565b600160a060020a0380841660009081526005602090815260408083203390941683529290529081205482111561061857600080fd5b600160a060020a0380851660009081526005602090815260408083203390941683529290522080548390039055610650848484610b3a565b50600190505b9392505050565b60035460ff1681565b60065460009033600160a060020a0390811691161461068457600080fd5b6000805485018155600160a060020a0386168082526004602052604091829020805487019055907ff852d0a3cf181ff3367de4646a22f9c0ea924ae0b367c74e07079a897f313c3c9086908690869051808481526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156107195780820151818401525b602001610700565b50505050905090810190601f1680156107465780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b8381101561077d5780820151818401525b602001610764565b50505050905090810190601f1680156107aa5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a284600160a060020a031660007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8660405190815260200160405180910390a35060015b949350505050565b600160a060020a0333811660009081526005602090815260408083209386168352929052908120548083111561086257600160a060020a03338116600090815260056020908152604080832093881683529290529081205561088d565b600160a060020a03338116600090815260056020908152604080832093881683529290522083820390555b600160a060020a0333811660008181526005602090815260408083209489168084529490915290819020547f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a3600191505b5092915050565b600160a060020a0381166000908152600460205260409020545b919050565b61091c610bcf565b60018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561052a5780601f106104ff5761010080835404028352916020019161052a565b820191906000526020600020905b81548152906001019060200180831161050d57829003601f168201915b505050505090505b90565b60006109ca338484610b3a565b90505b92915050565b600160a060020a033381166000818152600560209081526040808320948716808452949091528082208054860190819055919392917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925915190815260200160405180910390a35060015b92915050565b600160a060020a03331660009081526004602052604081205482901015610a6957600080fd5b600080548390038155600160a060020a033316808252600460205260409182902080548590039055907f222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a69084905190815260200160405180910390a2600033600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405190815260200160405180910390a35060015b919050565b600160a060020a038083166000908152600560209081526040808320938516835292905220545b92915050565b600160a060020a038316600090815260046020526040812054821115610b5f57600080fd5b600160a060020a038085166000818152600460205260408082208054879003905592861680825290839020805486019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9085905190815260200160405180910390a35060015b9392505050565b602060405190810160405260008152905600a165627a7a7230582074cccef856300516fb09b1a2d8f75df435a93668ccc8292d2488be922189d9630029';
        this.defaultGas = 100000;
        this.defaultGasPrice = 2000000000;
        this.transactions = {};
        this.contractAddress = contractAddress;
        this.contractOwner = contractOwner;
        this.accountPassword = accountPassword;
        const description = `connect to Ethereum node using websocket url ${wsURL}`;
        logger.debug(`About to ${description}`);
        this.web3 = new Web3(wsURL);
        // TODO need a way to validate that web3 connected to a node. The following will not work as web3 1.0 no longer supports web3.isCOnnected()
        // https://github.com/ethereum/web3.js/issues/440
        // if (!this.web3.isConnected())
        // {
        //     const error = new VError(`Failed to ${description}.`);
        //     logger.error(error.stack);
        //     throw(error);
        // }
        if (contractAddress) {
            this.contract = new this.web3.eth.Contract(this.jsonInterface, contractAddress, {
                from: contractOwner
            });
        }
        else {
            this.contract = new this.web3.eth.Contract(this.jsonInterface, {
                from: contractOwner
            });
        }
    }
    // deploy a new contract
    deployContract(contractOwner, symbol = "SET", tokenName = "Transferable Meetup token", gas = 1010000, gasPrice = 4000000000) {
        const self = this;
        this.contractOwner = contractOwner;
        const description = `deploy transferable meetup token with token symbol ${symbol}, token name "${tokenName}" from sender address ${self.contractOwner}, gas ${gas} and gasPrice ${gasPrice}`;
        return new Promise((resolve, reject) => {
            logger.debug(`About to ${description}`);
            try {
                self.contract.deploy({
                    data: self.binary,
                    arguments: [symbol, tokenName]
                })
                    .send({
                    from: contractOwner,
                    gas: gas,
                    gasPrice: gasPrice
                })
                    .on('transactionHash', (hash) => {
                    logger.debug(`Got transaction hash ${hash} from ${description}`);
                    self.transactions[hash] = 0;
                })
                    .on('receipt', (receipt) => {
                    logger.debug(`Created contract with address ${receipt.contractAddress} using ${receipt.gasUsed} gas for ${description}`);
                    self.contractAddress = receipt.contractAddress;
                    self.contract.options.address = receipt.contractAddress;
                    resolve(receipt.contractAddress);
                })
                    .on('confirmation', (confirmationNumber, receipt) => {
                    logger.trace(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);
                    self.transactions[receipt.transactionHash] = confirmationNumber;
                })
                    .on('error', (err) => {
                    const error = new VError(err, `Failed to ${description}.`);
                    logger.error(error.stack);
                    reject(error);
                });
            }
            catch (err) {
                const error = new VError(err, `Failed to ${description}.`);
                logger.error(error.stack);
                reject(error);
            }
        });
    }
    // issue an amount of tokens to an address
    issueTokens(toAddress, amount, externalId, reason, _gas, _gasPrice) {
        const self = this;
        const description = `issue ${amount} tokens to address ${toAddress}, from sender address ${self.contractOwner}, contract ${this.contract._address}, external id ${externalId} and reason ${reason}`;
        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;
        return new Promise((resolve, reject) => {
            self.contract.methods.issue(toAddress, amount, externalId, reason)
                .send({
                from: self.contractOwner,
                gas: gas,
                gasPrice: gasPrice
            })
                .on('transactionHash', (hash) => {
                logger.debug(`transaction hash ${hash} returned for ${description}`);
                self.transactions[hash] = 0;
            })
                .on('receipt', (receipt) => {
                if (receipt.gasUsed == gas) {
                    const error = new VError(`Used all ${gas} gas so transaction probably threw for ${description}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                logger.debug(`${receipt.gasUsed} gas used of a ${gas} gas limit for ${description}`);
                resolve(receipt.transactionHash);
            })
                .on('confirmation', (confirmationNumber, receipt) => {
                logger.trace(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);
                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
                .on('error', (err) => {
                const error = new VError(err, `Could not ${description}`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }
    // redeem tokens
    redeemTokens(amount, _gas, _gasPrice) {
        const self = this;
        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;
        const description = `redeem tokens from contract ${this.contract._address} from sender address ${self.contractOwner} and amount ${amount}`;
        return new Promise((resolve, reject) => {
            self.contract.methods.redeem(amount).send({
                from: self.contractOwner
            })
                .on('transactionHash', (hash) => {
                logger.info(`${description} returned transaction hash ${hash}`);
                self.transactions[hash] = 0;
            })
                .on('receipt', (receipt) => {
                if (receipt.gasUsed == gas) {
                    const error = new VError(`Used all ${gas} gas so transaction probably threw for ${description}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                logger.debug(`${receipt.gasUsed} gas used of a ${gas} gas limit for ${description}`);
                resolve(receipt.transactionHash);
            })
                .on('confirmation', (confirmationNumber, receipt) => {
                logger.trace(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);
                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
                .on('error', (err) => {
                const error = new VError(err, `Could not ${description}`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }
    getSymbol() {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `symbol of contract at address ${this.contract._address}`;
            try {
                const symbol = yield this.contract.methods.symbol().call();
                logger.info(`Got ${symbol} ${description}`);
                return symbol;
            }
            catch (err) {
                const error = new VError(err, `Could not get ${description}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `name of contract at address ${this.contract._address}`;
            try {
                const name = yield this.contract.methods.name().call();
                logger.info(`Got ${name} ${description}`);
                return name;
            }
            catch (err) {
                const error = new VError(err, `Could not get ${description}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    getTotalSupply() {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `total supply of contract at address ${this.contract._address}`;
            try {
                const totalSupplyStr = yield this.contract.methods.totalSupply().call();
                const totalSupply = Number(totalSupplyStr);
                logger.info(`Got ${totalSupply} ${description}`);
                return totalSupply;
            }
            catch (err) {
                const error = new VError(err, `Could not get ${description}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    getBalanceOf(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `balance of address ${address} in contract at address ${this.contract._address}`;
            try {
                const balanceStr = yield this.contract.methods.balanceOf(address).call();
                const balance = Number(balanceStr);
                logger.info(`Got ${balance} ${description}`);
                return balance;
            }
            catch (err) {
                const error = new VError(err, `Could not get ${description}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    getIssueEvents(reason, fromBlock = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `get unique list of external ids from past Issue events with reason ${reason} from block ${fromBlock} and contract address ${this.contract._address}`;
            const options = {
                fromBlock: fromBlock
            };
            try {
                logger.debug(`About to ${description}`);
                const events = yield this.contract.getPastEvents('Issue', options);
                logger.debug(`Got ${events.length} past Issue events`);
                const externalIds = _.chain(events)
                    .filter((event) => {
                    if (reason) {
                        return event.returnValues.reason == reason;
                    }
                    return true;
                })
                    .map(event => { return event.returnValues.externalId; })
                    .uniq()
                    .value();
                logger.info(`${externalIds.length} unique external ids successfully returned from ${description}`);
                return externalIds;
            }
            catch (err) {
                const error = new VError(err, `Could not ${description}`);
                console.log(error.stack);
                throw error;
            }
        });
    }
    unlockAccount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `unlock account with address ${address}`;
            try {
                logger.debug(`About to ${description}`);
                yield this.web3.eth.personal.unlockAccount(address, this.accountPassword, 0);
                logger.info(`Successfully ${description}`);
            }
            catch (err) {
                const error = new VError(err, `Could not ${description}`);
                console.log(error.stack);
                throw error;
            }
        });
    }
}
exports.default = TransferableToken;
//# sourceMappingURL=transferableToken.js.map