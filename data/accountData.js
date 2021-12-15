//data for importing in first
export const datas = [
    {
        "_id": 1,
        "username": "finalrei01",
        "password": "finalrei01",
        "type": "employee"
    },
    {
        "_id": 2,
        "username": "finalrei02",
        "password": "finalrei02",
        "type": "employee"
    },
    {
        "_id": 3,
        "username": "finalrei03",
        "password": "finalrei03",
        "type": "employee"
    }
]

//Data for test insert
export const insertData = {
    "_id": 4,
    "username": "finalrei02",
    "password": "finalrei01",
    "type": "employee"
}

//Wrong data for insert
export const insertWrongData = {
    "_id": 4,
    "username": 123,
    "password": "finalrei01",
    "type": "employee"
}

//Data for update
export const updateData = {
    "_id": 1,
    "username": "finalrei01",
    "password": "finalrei",
    "type": "employee"
}

//Data for search data by id
export const findData = {
    "_id": 1,
    "username": "finalrei01",
    "password": "finalrei01",
    "type": "employee"
}

//check structure for array data
export const getAllStructure = expect.arrayContaining([
    expect.objectContaining({
        _id: expect.any(Number),
        username: expect.any(String),
        password: expect.any(String),
        type: expect.any(String),
        __v: expect.any(Number)
    })
])

//check structure for data of create, read, update
export const crudStructure =expect.objectContaining({
        _id: expect.any(Number),
        username: expect.any(String),
        password: expect.any(String),
        type: expect.any(String),
        __v: expect.any(Number)
    })

