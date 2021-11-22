import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import { Product } from '../models/product.js';
import { datas, insertData, findData, updateData, checkProp } from '../data/productData.js';
import dotenv from 'dotenv';
dotenv.config();

let changeData = updateData;
let data = insertData;
let findProduct = findData;
let path = '/product/';

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop()
        } catch (error) {
            if (error.message === 'ns not found') return
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message);
        }
    }
}

describe( "Product API - PATH: /product", () => {

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

    //GET ALL PRODUCT
    describe("Method: GET - Path: /product/ - Description: Get all products from database", () => {

        test("Status code should be 200 ", async () => {
            const response = await request(app).get(path);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).get(path);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("List products should be Array & Length should be 3", async () => {
            const response = await request(app).get(path);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(datas.length);
        });
        test("All unit in list products should have full properties", async () => {
            const response = await request(app).get(path)
            let i = 0;
            while(i < response.body.length){
                expect(response.body[i]).toContainKeys(checkProp);
                i++;
            }
        });
    })

    //GET A PRODUCT BY ID
    describe("Method: GET - Path: /product/:_id - Description: Get an product from database by id", () => {

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
        test("Product should have full properties", async () => {
            const _id = 1;
            const response = await request(app).get(path + _id);
            expect(response.body).toContainKeys(checkProp);
        });
        test("Product should be same content with the one, we are finding", async () => {
            const find = findProduct;
            const response = await request(app).get(path + find._id)
            let checkFindData = Object.entries(find);
            expect(response.body).toContainEntries(checkFindData);

            // old way
            // expect(response.body._id).toBe(find._id);
            // expect(response.body.prodName).toBe(find.prodName);
            // expect(response.body.prodNumber).toBe(find.prodNumber);
            // expect(response.body.prodPrice).toBe(find.prodPrice);
            // expect(response.body.prodSale).toBe(find.prodSale);
            // expect(response.body.prodImageUrl).toBe(find.prodImageUrl);
            // expect(response.body.prodCategories).toEqual(find.prodCategories);
            // expect(response.body.prodAuthor).toEqual(find.prodAuthor);
        });
    })

    //CREATE PRODUCT
    describe("Method: POST - Path: /product/create - Description: Create a product", () => {
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
        test("Product should be into database", async () => {
            const response = await request(app).post(path + 'create').send(data);
            const product = await request(app).get(path + data._id);
            expect(product).toBeTruthy();
        });
        test("Product in response and database should be same content with creating product", async () => {
            await request(app).post(path + 'create').send(data).then(async (response) => {
                let checkInsertData = Object.entries(data);
                //Response Product
                expect(response.body[0]).toContainEntries(checkInsertData);

                //Database Product
                const product = await Product.findById(data._id);
                expect(product._doc).toContainEntries(checkInsertData);
            });
        })
    })

    //UPDATE PRODUCT
    describe("Method: PATCH - Path: /product/update - Description: Update a product", () => {
        test("Status code should be 200 ", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Product should be into database", async () => {
            const response = await request(app).patch(path + 'update').send(changeData);
            const product = await request(app).get(path + changeData._id);
            expect(product).toBeTruthy();
        });
        test("Product in response and database should be same content with updating product", async () => {
            await request(app).patch(path + 'update').send(changeData).then(async (response) => {
                let checkUpdateData = Object.entries(changeData);
                //Response Account
                expect(response.body).toContainEntries(checkUpdateData);

                //Database Product
                const product = await Product.findById(changeData._id);
                expect(product._doc).toContainEntries(checkUpdateData);
            });
        })
    })

    //DELETE PRODUCT
    describe("Method: DELETE - Path: /product/delete/:_id - Description: Delete an product from database by ID", () => {
        test("Status code should be 200 ", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(response.statusCode).toBe(204);
        });
        test("Account should be deleted from database", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await Product.findOne({_id: _id})).toBeFalsy();
        });
    })
});