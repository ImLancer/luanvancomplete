import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { Account } from '../models/account.js';
import { datas, insertData, updateData, findData, getAllStructure, crudStructure, insertWrongData } from '../data/accountData.js';
dotenv.config();

//Describe model
let Model = Account; // The model use for check the data in database
let unit; //Integrate with Model, place to save unit get from Model

//Describe data
let find = findData;
let data = insertData;
let wrongData = insertWrongData; //Data with wrong structure
let changeData = updateData;
let delete_id = 1;
let wrong_id = 50000; //Use for 404 check

//Describe path
let getAllPath = '/account/' //Use for both "GetAll" and "GetById". "GetById" integrate with findData you create in data
let createPath = '/account/create' //Use for "Create" integrate with data and wrongData
let createManyPath = '/account/createMany' //Use for "Create" integrate with data and wrongData
let updatePath = '/account/update' //Use for "Update" integrate with changeData
let deletePath = '/account/delete/' //Use for "Delete" integrate with delete_id

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
        const response = await request(app).post(createManyPath).send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL ACCOUNT
    describe("GET -- /account/ -- Get all accounts from database", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).get(getAllPath)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).get(getAllPath)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = await request(app).get(getAllPath).then((response) => {
                expect(response.body).toEqual(getAllStructure)
            })
        });
    })

    //GET AN ACCOUNT BY ID
    describe("GET -- /account/:_id -- Get an account from database by id", () => {
        test("Check status code: 200", async () => {
            const response = await request(app).get(getAllPath + find._id)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).get(getAllPath + find._id)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = await request(app).get(getAllPath + find._id).then((response) => {
                expect(response.body).toEqual(crudStructure)
            })
        });
        test("Check containing", async () => {
            const response = await request(app).get(getAllPath + find._id);
            unit = await Model.findOne({_id: find._id});
            let checkFindAccount = Object.entries(unit._doc);
            expect(response.body).toContainAllEntries(checkFindAccount);
        });
        test("Check error: 404 - File Not Found", async () => {
            const response = await request(app).get(getAllPath + wrong_id).expect(404);
        });
    })

    //CREATE ACCOUNT
    describe("POST -- /account/create -- Create an account", () => {
        afterEach( async () => {
            await request(app).delete(getAllPath + 'delete/4')
        })
        test("Check status code: 200", async () => {
            const response = await request(app).post(createPath).send(data)
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).post(createPath).send(data)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = await request(app).post(createPath).send(data).then((response) => {
                expect(response.body).toEqual(crudStructure)
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).post(createPath).send(data);
            unit = await Model.findById({_id: data._id});
            let checkInsertData = Object.entries(unit._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check request structure: \n\t[{ _id: Number, username: String, password: String, type: String }]", async () => {
            const response = await request(app).post(createPath).send(wrongData).expect(422);
        });
    })

    //UPDATE ACCOUNT
    describe("PATCH -- /account/update -- Update an account", () => {
        afterEach( async () => {
            await await request(app).patch(updatePath).send(datas[0]);
        })
        test("Check status code: 200", async () => {
            const response = await request(app).patch(updatePath).send(changeData);
            expect(response.statusCode).toBe(200);
        });
        test("Check content-type: JSON", async () => {
            const response = await request(app).patch(updatePath).send(changeData);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Check response structure: \n\t[{ _id: Number, username: String, password: String, type: String, __v: Number }]", async () => {
            const response = await request(app).patch(updatePath).send(changeData).then((response) => {
                expect(response.body).toEqual(crudStructure);
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(getAllPath + changeData._id);
            unit = await Model.findById({_id: changeData._id});
            let checkInsertData = Object.entries(unit._doc);
            expect(response.body).toContainAllEntries(checkInsertData);
        });
        test("Check request structure: \n\t[{ _id: Number, username: String, password: String, type: String }]", async () => {
            const response = await request(app).patch(updatePath).send(wrongData).expect(422);
        });
    })

    //DELETE ACCOUNT
    describe("DELETE -- /account/delete/:_id -- Delete an account from database by ID", () => {
        test("Check response status: 204", async () => {
            const response = await request(app).delete(deletePath + delete_id).then((response) => {
                expect(response.statusCode).toBe(204);
            })
        });
        test("Check data is deleted from DB", async () => {
            const response = await request(app).delete(deletePath + delete_id);
            expect(await Model.findOne({_id: delete_id})).toBeFalsy();
        });
        test("Check error: 404 - File Not Found", async () => {
            const response = await request(app).delete(deletePath + wrong_id).expect(404);
        });
    })
});