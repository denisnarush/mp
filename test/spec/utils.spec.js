import {toURLencoded} from "../../modules/utils.js";

describe("toURLencoded(params: object)", function () {
    it("incoming: {number: 2}; should returns: \"number=2\"", function () {
        chai.expect(toURLencoded({number: 2})).to.equal("number=2");
    });

    it("incoming: {string: \"John\"}; should returns: \"string=John\"", function () {
        chai.expect(toURLencoded({string: "John"})).to.equal("string=John");
    });

    it("incoming: {array: [1, \"John\"]}; should returns: \"array[0]=1&array[1]=John\"", function () {
        chai.expect(toURLencoded({array: [1, "John"]})).to.equal("array[0]=1&array[1]=John");
    });

    it("incoming: {number: 1, string: \"John\", array: [1, \"John\"]}; should returns: \"number=1&string=John&array[0]=1&array[1]=John\"", function () {
        chai.expect(toURLencoded({number: 1, string: "John", array: [1, "John"]})).to.equal("number=1&string=John&array[0]=1&array[1]=John");
    });
});