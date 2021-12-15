import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { Account } from '../models/account.js';
import { datas, insertData, updateData, findData, checkProp, insertWrongData } from '../data/accountData.js';
import { response } from 'express';
dotenv.config();

let changeData = updateData;
let data = insertData;
let wrongData = insertWrongData;
let findAccount = findData;
let path = '/accountTest/'

//https://zellwk.com/blog/jest-and-mongoose/
async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop();
        } catch (error) {
            if (error.message === 'ns not found') return
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message);
        }
    }
}

describe( "Account API", () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_TEST_URI, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
        });
        const response = await request(app).post('/accountTest/createMany').send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL ACCOUNT
    describe("GET -- /account/ -- Get all accounts from database", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).get("/accountTest/")
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).get("/accountTest/")
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = request(app).get("/accountTest/").then((response) =>{
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: expect.any(Number),
                            username: expect.any(String),
                            password: expect.any(String),
                            type: expect.any(String),
                            __v: expect.any(Number)
                        })
                    ])
                )
            })
        });
    })

    //GET AN ACCOUNT BY ID
    describe("GET -- /account/:_id -- Get an account from database by id", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).get("/accountTest/" + findAccount._id)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).get("/accountTest/" + findAccount._id)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = request(app).get("/accountTest/" + findAccount._id)
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(Number),
                        username: expect.any(String),
                        password: expect.any(String),
                        type: expect.any(String),
                        __v: expect.any(Number)
                    })
                ])
            )
        });
        test("Check containing", async () => {
            const response = await request(app).get(/accountTest/ + findAccount._id);
            const account = await Account.findOne({_id: findAccount._id});
            let checkFindAccount = Object.entries(account._doc);
            expect(response.body).toContainAllEntries(checkFindAccount);
        });
        test("Check error: 404 - File Not Found", async () => {
            let _id = '50000'
            const response = await request(app).get(/accountTest/ + _id).expect(404);
        });
    })

    //CREATE ACCOUNT
    describe("POST -- /account/create -- Create an account", () => {
        afterEach( async () => {
            await request(app).delete(path + 'delete/4')
        })
        test("Check status code: 200", async () => {
            const response = await request(app).post("/accountTest/" + 'create').send(data)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).post("/accountTest/" + 'create').send(data)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = await request(app).post(/accountTest/ + 'create').send(data).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        username: expect.any(String),
                        password: expect.any(String),
                        type: expect.any(String),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(/accountTest/ + data._id);
            const account = await Account.findById({_id: data._id});
            let checkInsertData = Object.entries(account._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check request structure: \n\t[{ _id: Number, username: String, password: String, type: String }]", async () => {
            const response = await request(app).post(/accountTest/ + 'create').send(wrongData).expect(422);
        });
    })

    //UPDATE ACCOUNT
    describe("PATCH -- /account/update -- Update an account", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).patch("/accountTest/" + 'update').send(changeData)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).patch("/accountTest/" + 'update').send(changeData)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = await request(app).patch(/accountTest/ + 'update').send(changeData).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        username: expect.any(String),
                        password: expect.any(String),
                        type: expect.any(String),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(/accountTest/ + changeData._id);
            const account = await Account.findById({_id: changeData._id});
            let checkInsertData = Object.entries(account._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check request structure: \n\t[{ _id: Number, username: String, password: String, type: String }]", async () => {
            const response = await request(app).patch(/accountTest/ + 'update').send(wrongData).expect(422);
        });
    })

    //DELETE ACCOUNT
    describe("DELETE -- /account/delete/:_id -- Delete an account from database by ID", () => {
        test("Check response status: 204", async () => {
            const _id = 1;
            const response = await request(app).delete(/accountTest/ + 'delete/' + _id).then((response) => {
                expect(response.statusCode).toBe(204)
            })
        });
        test("Check data is deleted from DB", async () => {
            const _id = 1;
            const response = await request(app).delete(/accountTest/ + 'delete/' + _id);
            expect(await Account.findOne({_id: _id})).toBeFalsy();
        });
        test("Check error: 404 - File Not Found", async () => {
            let _id = '50000'
            const response = await request(app).delete(/accountTest/ + 'delete/' + _id).expect(404);
        });
    })
});