const ApplicationController = require("./ApplicationController")
const request = require('supertest');
const { NotFoundError } = require("../errors");

describe("ApplicationController", () => {
    describe("#handleGetRoot", () => {
        it("should response with 200 as status code and jsons", async () => {
            const status = "OK"
            const message = "BCR API is up and running!"

            const ress = [{
                status:status,
                message:message
            }]

            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };

            const applicationcontroller = new ApplicationController();

            await applicationcontroller.handleGetRoot(mockRequest, mockResponse)

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(ress[0]);

        })
    });

    describe('#handleError', () => {
        it("should have return status 404 and error json", () => {

            const err = new Error("This one Error")

            const error = {
                error: {
                    name: err.name,
                    message: err.message,
                    details: err.details || null
                }
            }

            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };


            const applicationcontroller = new ApplicationController();
            applicationcontroller.handleError(err, mockRequest, mockResponse)

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith(error)
        })
    });

    describe('#handleNotFound', () => {
        it("should have return status 404 and error json", async () => {

            const mockRequest = {
                method: jest.fn().mockReturnThis(),
                url: jest.fn().mockReturnThis(),
            };
            const err = new NotFoundError(mockRequest.method, mockRequest.url);
            const error = {
                error: {
                    name: err.name,
                    message: err.message,
                    details: err.details
                }
            }
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };


            const applicationcontroller = new ApplicationController();
            await applicationcontroller.handleNotFound(mockRequest, mockResponse)

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(error)
        })
    });

    describe('#getOffsetFromRequest', () => {
        it("should have return status 404 and error json", async () => {

            const query = {page : 1, pageSize:10};
            const mockRequest = {
                query
            };

            const offset = (query.page - 1) * query.pageSize;


            const applicationcontroller = new ApplicationController();
            const result = await applicationcontroller.getOffsetFromRequest(mockRequest);

            expect(result).toBe(offset);
        })
    });

    describe('#buildPaginationObject', () => {
        it("should have return status 404 and error json", async () => {

            const query = {page : 1, pageSize:10};
            const count = 0;
            const mockRequest = {
                query
            };

            const pageCount = Math.ceil(count / query.pageSize);

            const balik =  [{
                page: query.page,
                pageCount,
                pageSize: query.pageSize,
                count
            }]

            const applicationcontroller = new ApplicationController();
            const result = await applicationcontroller.buildPaginationObject(mockRequest, count);

            expect(result).toStrictEqual(balik[0]);
        })
    });
})