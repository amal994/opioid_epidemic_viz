import logMessage from '../client'
describe('logMessage', () => {
    test('log Correct', () => {
        expect(logMessage("yay")).toEqual("yay")
    })
})