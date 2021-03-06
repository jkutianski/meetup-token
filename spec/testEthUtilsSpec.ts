import {extractEthAddress} from "../src/ethUtils"

const testAddress1 = "0x41809a48509517b377D5aFc9AE548747aF483568";
const testAddress2 = "0xCAA01bB79199033Dc7512967e095cB149B070Df5";

describe("Extract Ethereum addresses", function()
{
    it("Just the address", function() {
        const result = extractEthAddress(`${testAddress1}`);
        expect(result).toEqual(testAddress1);
    });

    it("Space before and after address", function() {
        const result = extractEthAddress(` ${testAddress1} `);
        expect(result).toEqual(testAddress1);
    });

    it("Tabs before and after address", function() {
        const result = extractEthAddress(`\t${testAddress1}\t`);
        expect(result).toEqual(testAddress1);
    });

    it("Carriage return before and after address", function() {
        const result = extractEthAddress(`\n${testAddress1}\n`);
        expect(result).toEqual(testAddress1);
    });

    it("Words before and after address", function() {
        const result = extractEthAddress(`Some words before address ${testAddress1} and after address`);
        expect(result).toEqual(testAddress1);
    });

    it("Incomplete addresses before address", function() {
        const result = extractEthAddress(`0x 0x1231 ${testAddress2} `);
        expect(result).toEqual(testAddress2);
    });
});
