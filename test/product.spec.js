import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import { Product } from '../models/product.js';
import { datas, insertData, findData, updateData, checkProp, insertWrongData } from '../data/productData.js';
import dotenv from 'dotenv';
dotenv.config();

let changeData = updateData;
let data = insertData;
let wrongData = insertWrongData;
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
        const response = await request(app).post(path + 'createMany').send(datas);
    })

    afterAll(async () => {
        await dropAllCollections();
        await mongoose.connection.close();
    })

    //GET ALL PRODUCT
    describe("Method: GET - Path: /product/ - Description: Get all products from database", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).get(path).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            _id: expect.any(Number),
                            prodName: expect.any(String),
                            prodNumber: expect.any(Number),
                            prodPrice: expect.any(Number),
                            prodSale: expect.any(Number),
                            prodImageUrl: expect.any(String),
                            prodCategories: expect.arrayContaining([expect.any(String)]),
                            prodAuthor: expect.arrayContaining([expect.any(String)]),
                            __v: expect.any(Number)
                        })
                    ])
                )
            })
        });
    })

    //GET A PRODUCT BY ID
    describe("Method: GET - Path: /product/:_id - Description: Get an product from database by id", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).get(path + findProduct._id).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        prodName: expect.any(String),
                        prodNumber: expect.any(Number),
                        prodPrice: expect.any(Number),
                        prodSale: expect.any(Number),
                        prodImageUrl: expect.any(String),
                        prodCategories: expect.arrayContaining([expect.any(String)]),
                        prodAuthor: expect.arrayContaining([expect.any(String)]),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check containing", async () => {
            const response = await request(app).get(path + findProduct._id);
            const product = await Product.findOne({_id: findProduct._id});
            let checkFindProduct = Object.entries(product._doc);
            expect(response.body).toContainAllEntries(checkFindProduct);
        });
        test("Check error 404", async () => {
            let _id = '50000'
            const response = await request(app).get(path + _id).expect(404);
        });
    })

    //CREATE PRODUCT
    describe("Method: POST - Path: /product/create - Description: Create a product", () => {
        
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).post(path + 'create').send(data).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        prodName: expect.any(String),
                        prodNumber: expect.any(Number),
                        prodPrice: expect.any(Number),
                        prodSale: expect.any(Number),
                        prodImageUrl: expect.any(String),
                        prodCategories: expect.arrayContaining([expect.any(String)]),
                        prodAuthor: expect.arrayContaining([expect.any(String)]),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(path + data._id);
            const product = await Product.findById({_id: data._id});
            let checkInsertProduct = Object.entries(product._doc);
            expect(response.body).toContainAllEntries(checkInsertProduct);
        });
        test("Check validate request", async () => {
            const response = await request(app).post(path + 'create').send(wrongData).expect(422);
        });
    })

    //UPDATE PRODUCT
    describe("Method: PATCH - Path: /product/update - Description: Update a product", () => {
        test("Check status, content-type, structure of response", async () => {
            const response = await request(app).patch(path + 'update').send(changeData).expect(200).expect('Content-Type', /json/).then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        _id: expect.any(Number),
                        prodName: expect.any(String),
                        prodNumber: expect.any(Number),
                        prodPrice: expect.any(Number),
                        prodSale: expect.any(Number),
                        prodImageUrl: expect.any(String),
                        prodCategories: expect.arrayContaining([expect.any(String)]),
                        prodAuthor: expect.arrayContaining([expect.any(String)]),
                        __v: expect.any(Number)
                    })
                )
            })
        });
        test("Check contain of data in DB", async () => {
            const response = await request(app).get(path + changeData._id);
            const product = await Product.findById({_id: changeData._id});
            let checkChangeData = Object.entries(product._doc);
            expect(response.body).toContainAllEntries(checkChangeData);
        });
        test("Check validate request", async () => {
            const response = await request(app).patch(path + 'update').send(wrongData).expect(422);
        });
    })

    //DELETE PRODUCT
    describe("Method: DELETE - Path: /product/delete/:_id - Description: Delete an product from database by ID", () => {
        test("Check status of response", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id).expect(204).then((response) => {
                expect(response.body).toEqual({})
            })
        });
        test("Check data is deleted from DB", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await Product.findOne({_id: _id})).toBeFalsy();
        });
        test("Check error 404", async () => {
            let _id = '50000'
            const response = await request(app).delete(path + 'delete/' + _id).expect(404);
        });
    })
});