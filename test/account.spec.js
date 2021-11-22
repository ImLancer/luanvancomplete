import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { Account } from '../models/account.js';
import { datas, insertData, updateData, findData, checkProp } from '../data/accountData.js';
dotenv.config();

let changeData = updateData;
let data = insertData;
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
        const response = await request(app).post(path + 'create').send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL ACCOUNT
    describe("Method: GET - Path: /account/ - Description: Get all accounts from database", () => {

        test("Status code should be 200", async () => {
            const response = await request(app).get(path);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).get(path);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("List accounts is sent back should be Array & Length should be 3", async () => {
            const response = await request(app).get(path);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(datas.length);
        });
        test("All unit in list accounts should have full properties", async () => {
            const response = await request(app).get(path);
            let i = 0;
            while(i < response.body.length){
                expect(response.body[i]).toContainKeys(checkProp);
                i++;
            }
        });
        // dan chung ve viec tiet kiem thoi gian khi dung auto
        // test("Response body [1] should have full object _id, username, password", async () => {
        //     const response = await request(app).get('/account/')
        //     expect(response.body[1]).toHaveProperty("_id");
        //     expect(response.body[1]).toHaveProperty("username");
        //     expect(response.body[1]).toHaveProperty("password");
        //     expect(response.body[1]).toHaveProperty("type");
        // });
    })

    //GET AN ACCOUNT BY ID
    describe("Method: GET - Path: /account/:_id - Description: Get an account from database by id", () => {
        test("Status code should be 200", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Account should have full properties", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id);
            expect(response.body).toContainKeys(checkProp);
        });
        test("Account should be same content with the one, we are finding", async () => {
            const response = await request(app).get(path + findAccount._id);
            let checkFindData = Object.entries(findAccount);
            expect(response.body).toContainEntries(checkFindData);

            // Old way
            // expect(response.body._id).toBe(findAccount._id);
            // expect(response.body.username).toBe(findAccount.username);
            // expect(response.body.password).toBe(findAccount.password);
            // expect(response.body.type).toBe(findAccount.type);
        });
    })

    //CREATE ACCOUNT
    describe("Method: POST - Path: /account/create - Description: Create an account", () => {

        afterEach( async () => {
            await request(app).delete(path + 'delete/4');
        })

        test("Status code should be 200", async () => {
            const response = await request(app).post(path + 'create').send(data);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).post(path + 'create').send(data);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Account should be save into database", async () => {
            const response = await request(app).post(path + 'create').send(data);
            const account = await request(app).get(path + data._id);
            expect(account).toBeTruthy();
        });
        test("Account in response and database should be same content with creating account", async () => {
            await request(app).post(path + 'create').send(data).then(async (response) => {
                let checkInsertData = Object.entries(data);
                //Response Account
                expect(response.body[0]).toContainEntries(checkInsertData);

                //Database Account
                const account = await Account.findById(data._id);
                expect(account._doc).toContainEntries(checkInsertData);
            });
        })
    })

    //UPDATE ACCOUNT
    describe("Method: PATCH - Path: /account/update - Description: Update an account", () => {

        test("Status code should be 200 ", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Account should be into database", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            const account = await request(app).get(path + changeData._id);
            expect(account).toBeTruthy();
        });
        test("Account in response and database should be same content with updating account", async () => {
            await request(app).patch(path + 'update').send(changeData).then(async (response) => {
                let checkUpdateData = Object.entries(changeData);
                //Response Account
                expect(response.body).toContainEntries(checkUpdateData);

                //Database Account
                const account = await Account.findById(changeData._id);
                expect(account._doc).toContainEntries(checkUpdateData);
            });
        })
    })

    //DELETE ACCOUNT
    describe("Method: DELETE - Path: /account/delete/:_id - Description: Delete an account from database by ID", () => {
        test("Status code should be 200 ", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(response.statusCode).toBe(204);
        });
        test("Account should be deleted from database", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await Account.findOne({_id: _id})).toBeFalsy();
        });
    })
});