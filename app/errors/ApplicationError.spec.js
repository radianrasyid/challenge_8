const ApplicationError = require("./ApplicationError");

describe("ApplicationError", () => {
    describe("#toJSON", () => {
        it("should return json", async () => {
            const error = [{
                error: {
                    name: "" || "Error",
                    message: "",
                    details: {}
                }
            }]

            const app = new ApplicationError();
            const result = await app.toJSON();
            const mockResponst = jest.fn();
            mockResponst.mockReturnValue(result);

            expect(mockResponst()).toStrictEqual(error[0])
        })
    })
})