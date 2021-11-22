import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import { User } from '../models/user.js';
import { datas, insertData, findData, updateData, checkProp } from '../data/userData.js';
import dotenv from 'dotenv';
dotenv.config();

let changeData = updateData;
let data = insertData;
let findUser = findData;
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
        const response = await request(app).post(path + 'create').send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL USER
    describe("Method: GET - Path: /user/ - Description: Get all users from database", () => {

        test("Status code should be 200 ", async () => {
            const response = await request(app).get(path);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).get(path);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("List users should be Array & Length should be 3", async () => {
            const response = await request(app).get(path);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(datas.length);
        });
        test("All unit in list users should have full properties", async () => {
            const response = await request(app).get(path);
            let i = 0;
            while(i < response.body.length){
                expect(response.body[i]).toContainKeys(checkProp);
                i++;
            }
        });
    })

    //GET AN USER BY ID
    describe("Method: GET - Path: /user/:_id - Description: Get an user from database by id", () => {
        test("Status code should be 200 ", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("User should have full properties", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id)
            expect(response.body).toContainKeys(checkProp);
        });
        test("User should be same content with the one, we are finding", async () => {
            const find = findUser;
            const response = await request(app).get(path + find._id);
            let checkFindData = Object.entries(find);
            expect(response.body).toContainEntries(checkFindData);

            // old way
            // expect(response.body._id).toBe(find._id);
            // expect(response.body.name).toBe(find.name);
            // expect(response.body.born).toBe(find.born);
            // expect(response.body.sex).toBe(find.sex);
            // expect(response.body.address).toBe(find.address);
            // expect(response.body.phone).toBe(find.phone);
            // expect(response.body.account).toBe(find.account);
        });
    })

    //CREATE USER
    describe("Method: POST - Path: /user/create - Description: Create an user", () => {
        afterEach( async () => {
            await request(app).delete(path + 'delete/4');
        })

        test("Status code should be 200 ", async () => {
            const response = await request(app).post(path + 'create').send(data);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).post(path + 'create').send(data);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("User should be into database", async () => {
            const response = await request(app).post(path + 'create').send(data);
            const user = await request(app).get(path + data._id);
            expect(user).toBeTruthy();
        });
        test("User in response and database should be same content with creating user", async () => {
            await request(app).post(path + 'create').send(data).then( async (response) => {
                let checkInsertData = Object.entries(data);
                //Response User
                expect(response.body[0]).toContainEntries(checkInsertData);

                //Database User
                const user = await User.findById(data._id);
                expect(user._doc).toContainEntries(checkInsertData);
            } );
        })
    })

    //UPDATE USER
    describe("Method: PATCH - Path: /user/update - Description: Update an user", () => {
        test("Status code should be 200", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("User should be into database", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            const user = await request(app).get(path + changeData._id);
            expect(user).toBeTruthy();
        });
        test("User in response and database should be same content with updating user", async () => {
            await request(app).patch(path + 'update').send(changeData).then( async (response) => {
                let checkUpdateData = Object.entries(changeData);
                //Response User
                expect(response.body).toContainEntries(checkUpdateData);

                //Database User
                const user = await User.findById(changeData._id);
                expect(user._doc).toContainEntries(checkUpdateData);
            } );
        })
    })

    //DELETE USER
    describe("Method: DELETE - Path: /user/delete/:_id - Description: Delete an user from database by ID", () => {
        test("Status code should be 200 ", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(response.statusCode).toBe(204);
        });
        test("User should be deleted from database", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await User.findOne({_id: _id})).toBeFalsy();
        });
    })
} );