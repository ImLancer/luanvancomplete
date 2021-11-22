import app from '../server.js'
import request from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { Order } from '../models/order.js';
import { datas, insertData, updateData, findData, checkProp, checkOrderItemsProp  } from '../data/orderData.js';
dotenv.config();

let changeData = updateData;
let data = insertData;
let findOrder = findData;
let path = '/order/';

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

describe( "Order API", () => {

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

    //GET ALL ORDER
    describe("Method: GET - Path: /order/ - Description: Get all order from database", () => {

        test("Status code should be 200 ", async () => {
            const response = await request(app).get(path);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).get(path);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("List orders should be Array & Length should be 3", async () => {
            const response = await request(app).get(path);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(datas.length);
        });
        test("All unit in list orders should have full properties", async () => {
            const response = await request(app).get(path);
            let i = 0;
            while(i < response.body.length){
                expect(response.body[i]).toContainKeys(checkProp);
                i++;
            }
        });
        test("All unit in list orders should have orderItems are Array & The length same with root data", async () => {
            const response = await request(app).get(path);
            let i = 0;
            while(i < response.body.length){
                expect(Array.isArray(response.body[i].orderItems)).toBeTruthy();
                expect(response.body[i].orderItems.length).toEqual(datas[i].orderItems.length);
                i++;
            }
        });
        test("All unit in list orderItems of each order should have full properties", async () => {
            const response = await request(app).get(path);
            let i = 0; // Unit of list orders
            let j = 0; // Unit of list orderItems
            while(i < response.body.length){
                while(j < response.body[i].orderItems.length){
                    expect(response.body[i].orderItems[j]).toContainKeys(checkOrderItemsProp);
                    j++;
                }
                j = 0;
                i++;
            }
        });
    })

    //GET AN ORDER BY ID
    describe("Method: GET - Path: /order/:_id - Description: Get an order from database by id", () => {
        test("Status code should be 200", async () => {
            const response = await request(app).get(path + findOrder._id)
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).get(path + findOrder._id)
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Order should have full properties", async () => {
            const response = await request(app).get(path + findOrder._id)
            expect(response.body).toContainKeys(checkProp);
        });

        test("Order should be same content with the one, we are finding", async () => {
            const response = await request(app).get(path + findOrder._id);
            let checkFindData = Object.entries(findOrder);
            expect(response.body).toContainEntries(checkFindData);
        });
        test("List orderItems should be Array & same Length with list of the order we are finding", async () => {
            const response = await request(app).get(path + findOrder._id);
            expect(Array.isArray(response.body.orderItems)).toBeTruthy();
            expect(response.body.orderItems.length).toEqual(findOrder.orderItems.length);
        });
        test("All unit of list orderItems should have full properties", async () => {
            const response = await request(app).get(path + findOrder._id);
            let i = 0; // Unit of list orderItems
            while(i < response.body.orderItems.length){
                expect(response.body.orderItems[i]).toContainKeys(checkOrderItemsProp);
                i++;
            }
        });
        test("Each unit of list orderItems should be same content with order we are finding.", async () => {
            const response = await request(app).get(path + findOrder._id);
            let i = 0;
            while(i < response.body.orderItems.length){
                let checkFindData = Object.entries(findOrder.orderItems[i]);
                expect(response.body.orderItems[i]).toContainEntries(checkFindData);
                i++;
            }
        });
    })

    //CREATE ORDER
    describe("Method: POST - Path: /order/create - Description: Create an order", () => {

        afterEach( async () => {
            await request(app).delete(path + 'delete/4')
        })

        test("Status code should be 200 ", async () => {
            const response = await request(app).post(path + 'create').send(data);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).post(path + 'create').send(data);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Order should be into database", async () => {
            const response = await request(app).post(path + 'create').send(data);
            const order = await request(app).get(path + data._id);
            expect(order).toBeTruthy();
        });
        test("Order in response and database should be same content with creating order", async () => {
            const response = await request(app).post(path + 'create').send(data);

            const order = await request(app).get(path + data._id);
            let checkInsertData = Object.entries(data);
            // Check response
            expect(response.body[0]).toContainEntries(checkInsertData);
            // Check database
            expect(order.body).toContainEntries(checkInsertData);
            // orderItem check
            let i = 0;
            while(i < response.body[0].orderItems.length){
                let checkOrderItemData = Object.entries(data.orderItems[i]);
                // Check response
                expect(response.body[0].orderItems[i]).toContainEntries(checkOrderItemData);
                // Check database
                expect(order.body.orderItems[i]).toContainEntries(checkOrderItemData);
                i++;
            }
        })
    })

    //UPDATE ORDER STATUS
    describe("Method: PATCH - Path: /order/updateStatus - Description: Update status of order", () => {

        test("Status code should be 200 ", async () => {
            const response = await request(app).patch(path + 'updateStatus').send(changeData);
            expect(response.statusCode).toBe(200);
        });
        test("Content type header should be json", async () => {
            const response = await request(app).patch(path + 'updateStatus').send(changeData);
            expect(response.header['content-type']).toBe('application/json; charset=utf-8');
        });
        test("Order status should be changed into database", async () => {
            const response = await request(app).patch(path + 'updateStatus').send(changeData);
            const order = await request(app).get(path + changeData._id);
            expect(order).toBeTruthy();
        });
        test("Order status of response and database should be updated", async () => {
            await request(app).patch(path + 'updateStatus').send(changeData).then(async (response) => {
                //Reponse Order
                expect(response.body.orderStatus).toBe(changeData.orderStatus);

                //Database Order
                const order = await Order.findById(changeData._id);
                expect(order.orderStatus).toBe(changeData.orderStatus);
            });
        })
    })

    //DELETE ORDER
    describe("Method: DELETE - Path: /order/delete/:_id - Description: Delete an order from database by ID", () => {
        test("Status code should be 200 ", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(response.statusCode).toBe(204);
        });
        test("Account should be deleted from database", async () => {
            const _id = 1;
            const response = await request(app).delete(path + 'delete/' + _id);
            expect(await Order.findOne({_id: _id})).toBeFalsy();
        });
    })
})