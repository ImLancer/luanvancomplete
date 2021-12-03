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
let path = '/account/'

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
        const response = await request(app).post(path + 'createMany').send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL ACCOUNT
    describe("Method: GET - Path: /account/ - Description: Get all accounts from database", () => {

        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).get(path).expect(200).expect('Content-Type', /json/).then((response) => {
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
    describe("Method: GET - Path: /account/:_id - Description: Get an account from database by id", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).get(path + findAccount._id).expect(200).expect('Content-Type', /json/).then((response) => {
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
        test("Check containing", async () => {
            const response = await request(app).get(path + findAccount._id);
            const account = await Account.findOne({_id: findAccount._id});
            let checkFindAccount = Object.entries(account._doc);
            expect(response.body).toContainAllEntries(checkFindAccount);
        });
        test("Check error 404", async () => {
            let _id = '50000'
            const response = await request(app).get(path + _id).expect(404);
        });
    })

    //CREATE ACCOUNT
    describe("Method: POST - Path: /account/create - Description: Create an account", () => {

        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).post(path + 'create').send(data).expect(200).expect('Content-Type', /json/).then((response) => {
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
            const response = await request(app).get(path + data._id);
            const account = await Account.findById({_id: data._id});
            let checkInsertData = Object.entries(account._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check validate request", async () => {
            const response = await request(app).post(path + 'create').send(wrongData).expect(422);
        });
    })

    //UPDATE ACCOUNT
    describe("Method: PATCH - Path: /account/update - Description: Update an account", () => {

        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).patch(path + 'update').send(changeData).expect(200).expect('Content-Type', /json/).then((response) => {
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
            const response = await request(app).get(path + changeData._id);
            const account = await Account.findById({_id: changeData._id});
            let checkInsertData = Object.entries(account._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check validate request", async () => {
            const response = await request(app).patch(path + 'update').send(wrongData).expect(422);
        });
    })

    //DELETE ACCOUNT
    describe("Method: DELETE - Path: /account/delete/:_id - Description: Delete an account from database by ID", () => {
        test("Check status of response", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id).expect(204).then((response) => {
                expect(response.body).toEqual({})
            })
        });
        test("Check data is deleted from DB", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await Account.findOne({_id: _id})).toBeFalsy();
        });
        test("Check error 404", async () => {
            let _id = '50000'
            const response = await request(app).delete(path + 'delete/' + _id).expect(404);
        });
    })
});