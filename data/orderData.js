export const datas = [
    {
        "_id": 1,
        "orderStatus": false,
        "orderTotalPrice": 25000,
        "orderDate": "15-11-2021",
        "orderAddress": "243 Quang Trung, Xuan Khanh, Ninh Kieu, Can Tho",
        "orderTransport": "viettelpost",
        "orderPayment": "direct",
        "orderItems": [
            {
                "_id": 1,
                "itemQuantity": 1,
                "itemTotalPrice": 25000,
                "product_id": 1
            }
        ]
    },
    {
        "_id": 2,
        "orderStatus": false,
        "orderTotalPrice": 125000,
        "orderDate": "20-10-2021",
        "orderAddress": "243 Quang Trung, Xuan Khanh, Ninh Kieu, Can Tho",
        "orderTransport": "viettelpost",
        "orderPayment": "direct",
        "orderItems": [
            {
                "_id": 1,
                "itemQuantity": 1,
                "itemTotalPrice": 25000,
                "product_id": 1
            },
            {
                "_id": 2,
                "itemQuantity": 2,
                "itemTotalPrice": 50000,
                "product_id": 2
            }
        ]
    },
    {
        "_id": 3,
        "orderStatus": false,
        "orderTotalPrice": 225000,
        "orderDate": "10-11-2021",
        "orderAddress": "243 Quang Trung, Xuan Khanh, Ninh Kieu, Can Tho",
        "orderTransport": "viettelpost",
        "orderPayment": "direct",
        "orderItems": [
            {
                "_id": 1,
                "itemQuantity": 1,
                "itemTotalPrice": 25000,
                "product_id": 1
            },
            {
                "_id": 2,
                "itemQuantity": 2,
                "itemTotalPrice": 50000,
                "product_id": 2
            },
            {
                "_id": 3,
                "itemQuantity": 3,
                "itemTotalPrice": 100000,
                "product_id": 3
            }
        ]
    }
]
export const checkProp = [
    "_id",
    "orderStatus",
    "orderTotalPrice",
    "orderDate",
    "orderAddress",
    "orderTransport",
    "orderPayment",
    "orderItems",
]
export const checkOrderItemsProp = [
    "_id",
    "itemQuantity",
    "itemTotalPrice",
    "product_id",
]

export const insertData = {
    "_id": 4,
    "orderStatus": false,
    "orderTotalPrice": 25000,
    "orderDate": "15-11-2021",
    "orderAddress": "243 Quang Trung, Xuan Khanh, Ninh Kieu, Can Tho",
    "orderTransport": "viettelpost",
    "orderPayment": "direct",
    "orderItems": [
        {
            "_id": 1,
            "itemQuantity": 1,
            "itemTotalPrice": 25000,
            "product_id": 1
        }
    ]
}

export const updateData = {
    "_id": 1,
    "orderStatus": true
}

export const findData = {
    "_id": 1,
    "orderStatus": false,
    "orderTotalPrice": 25000,
    "orderDate": "15-11-2021",
    "orderAddress": "243 Quang Trung, Xuan Khanh, Ninh Kieu, Can Tho",
    "orderTransport": "viettelpost",
    "orderPayment": "direct",
    "orderItems": [
        {
            "_id": 1,
            "itemQuantity": 1,
            "itemTotalPrice": 25000,
            "product_id": 1
        }
    ]
}