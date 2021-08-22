const Parameter = require("./Parameter")
// @ponicode
describe("componentDidUpdate", () => {
    let inst

    beforeEach(() => {
        inst = new Parameter.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.componentDidUpdate()
        }
    
        expect(callFunction).not.toThrow()
    })
})
