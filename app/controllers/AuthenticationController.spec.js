const { InsufficientAccessError } = require("../errors");
const AuthenticationController = require("./AuthenticationController");
const {JWT_SIGNATURE_KEY} = require("../../config/application")
const userModel = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { User } = require("../models")


describe("#AuthenticationController", () => {
    describe("#createTokenFromUser", () => {
        it("it should create new token", async () => {
            const user = {
                id: 1,
                name: "radian",
                email: "radian@gmail.com",
                image: "radian.jpg",
            }

            const role = {
                    id: 1,
                    name: "ADMIN"
            }

            const mockUser = user;
            const mockRole = role;

            const token = jsonwebtoken.sign({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                image: mockUser.image,
                role: {
                    id: mockRole.id,
                    name: mockRole.name
                }
            }, JWT_SIGNATURE_KEY)

            const app = new AuthenticationController({jwt:jsonwebtoken})
            const result = await app.createTokenFromUser(mockUser, mockRole)
            const hasil = jest.fn();
            hasil.mockReturnValue(result)

            expect(result).toEqual(token)
        })
    });

    describe("#decodeToken", () => {
        it("should decode token", async () => {
            const user = {
                id: 1,
                name: "radian",
                email: "radian@gmail.com",
                image: "radian.jpg",
            }

            const role = {
                    id: 1,
                    name: "ADMIN"
            }

            const mockUser = user;
            const mockRole = role;

            const token = jsonwebtoken.sign({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                image: mockUser.image,
                role: {
                    id: mockRole.id,
                    name: mockRole.name
                }
            }, JWT_SIGNATURE_KEY)

            const decoded = jsonwebtoken.verify(token, JWT_SIGNATURE_KEY)
            const app = new AuthenticationController({jwt: jsonwebtoken})
            const result = await app.decodeToken(token)

            expect(result).toEqual(decoded)
        })
    });

    describe("#encryptPassword", () => {
        it("should encrypt the password", async () => {
            const password = "kelompok4NJAY";
            const encrypt = bcrypt.hashSync(password, 10);

            const app = new AuthenticationController({jwt:jsonwebtoken, bcrypt:bcrypt})
            const result = await app.encryptPassword(password);

            expect(result.slice(0, -53)).toEqual(encrypt.slice(0, -53));
        })
    });

    describe("#verifyPassword", () => {
        it("should verify password and encrypted one", async () => {
            const password = "radianrasyid";

            const encrypt = bcrypt.hashSync(password, 0);

            const verif = bcrypt.compareSync(password, encrypt)

            const app = new AuthenticationController({jwt:jsonwebtoken, bcrypt:bcrypt})
            const result = await app.verifyPassword(password, encrypt);

            expect(result).toEqual(verif)
        })
    });

    describe("#handleLogin", () => {
        it("should register user", async () => {
            const id = 1;
            const email = "radian@gmail.com";
            const password = "radianrasyid";

            const token = bcrypt.hashSync(password, 10);
            
            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const mockNext = jest.fn();
            const user = {
                id: id,
                name: "radian",
                email: email,
                image:"radian.jpg",
                role: {
                    id:1,
                    name: "ADMIN",
                }
            }

            const mockUserModel = {};
            const mockUser = new User(user)
            mockUserModel.findOne = jest.fn().mockReturnValue(mockUser)
            const app = new AuthenticationController({userModel: mockUserModel})

            if(!user){
                const err = new Error("Not Found");
                await app.handleLogin(mockRequest, mockResponse, mockNext)
                expect(mockResponse.status).toHaveBeenCalledWith(404);
                expect(mockResponse.json).toHaveBeenCalledWith(err);
            }

            // const isPasswordCorrect = await app.verifyPassword(password, token);
            const ispasscorr = bcrypt.compare(password, token);

            if(!ispasscorr){
                const err = new Error("Wrong");
                await app.handleLogin(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(401);
                expect(mockResponse.json).toHaveBeenCalledWith(err);
            }

            // const accessToken = await app.createTokenFromUser(user, user.role);
            const accessToken = await jsonwebtoken.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: {
                  id: user.role.id,
                  name: user.role.name,
                }
              }, JWT_SIGNATURE_KEY);

            await app.handleLogin(mockRequest, mockResponse, mockNext)

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(accessToken);
        });

        it("should return error", async () => {
            const id = 1;
            const email = "radian@gmail.com";
            const password = "radianrasyid";

            const token = bcrypt.hashSync(password, 10);
            
            const mockRequest = {};
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            const mockNext = jest.fn();
            const user = {
                id: id,
                name: "radian",
                email: email,
                image:"radian.jpg",
                role: {
                    id:1,
                    name: "ADMIN",
                }
            }

            const mockUserModel = {};
            const mockUser = new User(user)
            const pengguna = mockUserModel.findOne = jest.fn().mockReturnValue(mockUser)
            const app = new AuthenticationController({userModel: mockUserModel})

            if(!pengguna){
                const err = new Error("Not Found");
                await app.handleLogin(mockRequest, mockResponse, mockNext)
                expect(mockResponse.status).toHaveBeenCalledWith(404);
                expect(mockResponse.json).toHaveBeenCalledWith(err);
            }

            // const isPasswordCorrect = await app.verifyPassword(password, token);
            const ispasscorr = await bcrypt.compareSync(password, token)

            if(!ispasscorr){
                const err = new Error("Wrong");
                await app.handleLogin(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(401);
                expect(mockResponse.json).toHaveBeenCalledWith(err);
            }

            const err = new Error("something");

            const accessToken = await jsonwebtoken.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: {
                  id: user.role.id,
                  name: user.role.name,
                }
              }, JWT_SIGNATURE_KEY);
            await app.handleLogin(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalled()
        })
    })
})