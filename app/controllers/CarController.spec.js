const CarController = require("./CarController");
const { Car } = require("../models");
const { append, json } = require("express/lib/response");
const ApplicationController = require("./ApplicationController");
const application = require("../../config/application");

describe("CarController", () => {
    describe("#getCarFromRequest", () => {
        it("should return res.status(200) and a json", async () => {

            const name = "Subaru";
            const prompt = "Imprezza";

            const mockRequest = {
                params: {
                    id: 1
                }
            }

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar)

            const mockResponse = {};
            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.json = jest.fn().mockReturnThis();

            const carcontroller = new CarController({carModel: mockCarModel});
            const result = await carcontroller.getCarFromRequest(mockRequest);

            expect(result).toStrictEqual(mockCar)
        })
    });

    describe("#handleDeleteCar", () => {
        it("should return res.status(204) and a json", async () => {

            const name = "Subaru";
            const prompt = "Imprezza";

            const mockRequest = {
                params: {
                    id: 1
                }
            }

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.destroy = jest.fn().mockReturnValue(mockCar)

            const mockResponse = {};
            mockResponse.status = jest.fn().mockReturnThis();
            mockResponse.end = jest.fn().mockReturnThis();

            const carcontroller = new CarController({carModel: mockCarModel});
            await carcontroller.handleDeleteCar(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.end).toHaveBeenCalled()
        })
    });

    describe("#handleGetCar", () => {
        it("should return a value", async () => {
            const name = "subaru";
            const prompt = "imprezza";

            const mockRequest = {
                params: {
                    id: 1
                }
            };

            const mockCar = new Car({name, prompt})
            const mockCarModel = {}
            mockCarModel.findByPk = jest.fn().mockReturnValue(mockCar)
            const app = new CarController({carModel: mockCarModel});

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            await app.handleGetCar(mockRequest, mockResponse);
            const app1 = await app.getCarFromRequest(mockRequest);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(app1)
        })
    });

    describe("#handleListCars", () => {
        it("should return res.status(200) and a json", async () => {
            
            const name = "Subaru";
            const prompt = "Imprezza";

            const mockRequest = {
                params: {
                    id:1
                },
                query:{
                    page:1,
                    pageSize:0
                }
            }
            const carCount = 10;
            const pageCount = Math.ceil(carCount/mockRequest.query.pageSize)
            const pagination = {
                page: mockRequest.query.page,
                pageCount,
                pageSize: mockRequest.query.pageSize,
                count: carCount,
            }

            const mockCar = new Car({id: mockRequest.params.id, name, prompt});
            const mockCarModel = {findAll: jest.fn().mockReturnValue(mockCar), count: jest.fn().mockReturnValue(10)}
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis()
            };

            const app = new CarController({carModel: mockCarModel})
            await app.handleListCars(mockRequest, mockResponse);
            const cars = mockCarModel.findAll;
            const mockMobil = jest.fn(() => {
                return cars;
            })
            const mobils = jest.fn();
            mobils.mockReturnValue(mockMobil)
            const query = await app.getListQueryFromRequest(mockRequest)

            const baru = {
                cars: mobils,
                meta: {
                    pagination
                }
            }

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(baru)
        })
    });

    describe("#handleUpdateCar", () => {
        it("should return res.status(201) and created a new car entry", async () => {
            const name = "subaru";
            const price = 100000;
            const size = "Small";
            const image = "radian.jpg"
    
            const mockRequest = {
                params: {
                    id:1
                },
                body: {
                    name,
                    price,
                    size,
                    image,
                }
            }

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }

            const mockCarModel = {};
            const mockCar = new Car(mockRequest.body)
            const app = new CarController({carModel: mockCarModel})
            // const request = await app.getCarFromRequest(mockRequest);

            const newCar = {
                name: mockRequest.body.name,
                price: mockRequest.body.price,
                size: mockRequest.body.size,
                image: mockRequest.body.image,
                isCurrentlyRented: false
            }

            await app.handleUpdateCar(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(422);
            expect(mockResponse.json).toHavebeenCalledWith(mockCar)

        })
    })

    describe("#handleCreateCar", () => {
        it("should return created Car", async () => {
            const payloadCar = { 
                name: "brio", 
                price: 50000, 
                size: "large", 
                image: "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg", 
                isCurrentlyRented: false, 
            }; 
     
            const mockModel = {} 
     
            const mockTest = new Car(payloadCar) 
     
            mockModel.create = jest.fn().mockReturnValue(mockTest) 
     
            const mockResponse = { 
                status: jest.fn().mockReturnThis(), 
                json: jest.fn().mockReturnThis(), 
            }; 
     
     
            const mockRequest = { 
                body: { 
                    payloadCar, 
                } 
            }; 
     
            const app = new CarController({ 
                carModel: mockModel 
            }); 
     
            const hasil = mockModel.create(payloadCar) 
     
            await app.handleCreateCar(mockRequest, mockResponse) 
     
            const result = await app.handleCreateCar(mockRequest, mockResponse) 
     
            expect(mockResponse.status).toHaveBeenCalledWith(201); 
            expect(mockResponse.json).toHaveBeenCalledWith(hasil); 
        });

        it("should return error", async () => {
            const err = new Error("not Found!");
            const payloadCar = { 
                name: "brio", 
                price: 50000, 
                size: "large", 
                image: "https://upload.wikimedia.org/wikipedia/commons/0/07/2020_Honda_Brio_Satya_E_1.2_DD1_%2820211006%29.jpg", 
                isCurrentlyRented: false, 
            }; 
     
            const mockModel = {} 
     
            const mockTest = new Car(payloadCar) 
     
            mockModel.create = jest.fn().mockReturnValue(Promise.reject(err)) 
     
            const mockResponse = { 
                status: jest.fn().mockReturnThis(), 
                json: jest.fn().mockReturnThis(), 
            }; 
     
     
            const mockRequest = { 
                body: { 
                    payloadCar, 
                } 
            }; 
     
            const app = new CarController({ 
                carModel: mockModel 
            }); 
     
            const hasil = mockModel.create(payloadCar) 
     
            await app.handleCreateCar(mockRequest, mockResponse) 
            expect(mockResponse.status).toHaveBeenCalledWith(422); 
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                error: { 
                    name: err.name, 
                    message: err.message, 
                } 
            }); 
        })
    })
})