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
    describe("GET -- /user/ -- Get all users from database", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).get(path)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).get(path)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{\n\t _id: Number,\n\t name: String,\n\t born: Number,\n\t sex: String,\n\t taddress: String,\n\t phone: String,\n\t account: String,\n\t __v: Number\n\t}]", async () => {
            const response = await request(app).get(path).then((response) => {
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
    describe("GET -- /user/:_id -- Get an user from database by id", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).get(path + findUser._id)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).get(path + findUser._id)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{\n\t _id: Number,\n\t name: String,\n\t born: Number,\n\t sex: String,\n\t taddress: String,\n\t phone: String,\n\t account: String,\n\t __v: Number\n\t}]", async () => {
            const response = await request(app).get(path + findUser._id).then((response) => {
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
        test("Check error: 404 - File Not Found", async () => {
            let _id = '50000'
            const response = await request(app).get(path + _id).expect(404);
        });
    })

    //CREATE USER
    describe("POST -- /user/create -- Create an user", () => {
        afterEach( async () => {
            await request(app).delete(path + 'delete/4')
        })
        test("Check status code: 200", async () => {
            const response = await request(app).post(path + 'create').send(data)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).post(path + 'create').send(data)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{\n\t _id: Number,\n\t name: String,\n\t born: Number,\n\t sex: String,\n\t taddress: String,\n\t phone: String,\n\t account: String,\n\t __v: Number\n\t}]", async () => {
            const response = await request(app).post(path + 'create').send(data).then((response) => {
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
            const response = await request(app).post(path + 'create').send(data);
            const user = await User.findById({_id: data._id});
            let checkInsertData = Object.entries(user._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check request structure: \n\t[{\n\t _id: Number,\n\t name: String,\n\t born: Number,\n\t sex: String,\n\t taddress: String,\n\t phone: String,\n\t account: String,\n\t __v: Number\n\t}]", async () => {
            const response = await request(app).post(path + 'create').send(wrongData).expect(422);
        });
    })

    //UPDATE USER
    describe("PATCH -- /user/update -- Update an user", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).patch(path + 'update').send(changeData)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).patch(path + 'update').send(changeData)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{\n\t _id: Number,\n\t name: String,\n\t born: Number,\n\t sex: String,\n\t taddress: String,\n\t phone: String,\n\t account: String,\n\t __v: Number\n\t}]", async () => {
            const response = await request(app).patch(path + 'update').send(changeData).then((response) => {
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
        test("Check request structure: \n\t[{\n\t _id: Number,\n\t name: String,\n\t born: Number,\n\t sex: String,\n\t taddress: String,\n\t phone: String,\n\t account: String,\n\t __v: Number\n\t}]", async () => {
            const response = await request(app).patch(path + 'update').send(wrongData).expect(422);
        });
    })

    //DELETE USER
    describe("DELETE -- /user/delete/:_id -- Delete an user from database by ID", () => {
        test("Check response status: 204", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id).then((response) => {
                expect(response.statusCode).toBe(204)
            })
        });
        test("Check data is deleted from DB", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await User.findOne({_id: _id})).toBeFalsy();
        });
        test("Check error: 404 - File Not Found", async () => {
            let _id = '50000'
            const response = await request(app).delete(path + 'delete/' + _id).expect(404);
        });
    })
} );