import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import { User } from '../models/user.js';
import { datas, insertData, findData, updateData, checkProp, insertWrongData } from '../data/userData.js';
import dotenv from 'dotenv';
dotenv.config();

let changeData = updateData;
let data = insertData;
let findUser = findData;
let wrongData = insertWrongData
let path = '/user/'

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            if (error.message === 'ns not found') return
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message);
        }
    }
}

describe( "API User - PATH: /user", () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_TEST_URI, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
        });
        const response = await request(app).post(path + 'createMany').send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL USER
    describe("Method: GET - Path: /user/ - Description: Get all users from database", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).get(path).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: expect.any(Number),
                            name: expect.any(String),
                            born: expect.any(Number),
                            sex: expect.any(String),
                            address: expect.any(String),
                            phone: expect.any(String),
                            account: expect.any(String),
                            __v: expect.any(Number)
                        })
                    ])
                )
            })
        });
    })

    //GET AN USER BY ID
    describe("Method: GET - Path: /user/:_id - Description: Get an user from database by id", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).get(path + findUser._id).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        name: expect.any(String),
                        born: expect.any(Number),
                        sex: expect.any(String),
                        address: expect.any(String),
                        phone: expect.any(String),
                        account: expect.any(String),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check containing", async () => {
            const response = await request(app).get(path + findUser._id);
            const user = await User.findOne({_id: findUser._id});
            let checkFindUser = Object.entries(user._doc);
            expect(response.body).toContainAllEntries(checkFindUser);
        });
        test("Check error 404", async () => {
            let _id = '50000'
            const response = await request(app).get(path + _id).expect(404);
        });
    })

    //CREATE USER
    describe("Method: POST - Path: /user/create - Description: Create an user", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).post(path + 'create').send(data).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        name: expect.any(String),
                        born: expect.any(Number),
                        sex: expect.any(String),
                        address: expect.any(String),
                        phone: expect.any(String),
                        account: expect.any(String),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(path + data._id);
            const user = await User.findById({_id: data._id});
            let checkInsertData = Object.entries(user._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check validate request", async () => {
            const response = await request(app).post(path + 'create').send(wrongData).expect(422);
        });
    })

    //UPDATE USER
    describe("Method: PATCH - Path: /user/update - Description: Update an user", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).patch(path + 'update').send(changeData).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        name: expect.any(String),
                        born: expect.any(Number),
                        sex: expect.any(String),
                        address: expect.any(String),
                        phone: expect.any(String),
                        account: expect.any(String),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(path + changeData._id);
            const user = await User.findById({_id: changeData._id});
            let checkChangeData = Object.entries(user._doc);
            expect(response.body).toContainAllEntries(checkChangeData);
        });
        test("Check validate request", async () => {
            const response = await request(app).patch(path + 'update').send(wrongData).expect(422);
        });
    })

    //DELETE USER
    describe("Method: DELETE - Path: /user/delete/:_id - Description: Delete an user from database by ID", () => {
        test("Check status of response", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id).expect(204).then((response) => {
                expect(response.body).toEqual({})
            })
        });
        test("Check data is deleted from DB", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await User.findOne({_id: _id})).toBeFalsy();
        });
        test("Check error 404", async () => {
            let _id = '50000'
            const response = await request(app).delete(path + 'delete/' + _id).expect(404);
        });
    })
} );