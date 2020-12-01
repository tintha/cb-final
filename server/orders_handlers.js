"use strict";
const { MongoClient } = require("mongodb");
const { ObjectID } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const APP_DB = "cb-final";
const ORDERS_COLLECTION = "orders";

const getOrders = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(APP_DB);
    const orders = await db.collection(ORDERS_COLLECTION).find().toArray();
    if (orders.length === 0) {
      res.status(404).json({
        status: 404,
        message: "No orders found",
      });
    } else {
      res.status(200).json({
        status: 200,
        data: orders,
      });
    }
    client.close();
  } catch (e) {
    console.log(e);
  }
};

const getOrderById = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(APP_DB);
    const order = await db
      .collection(ORDERS_COLLECTION)
      .findOne({ _id: ObjectID(orderId) });
    assert(1, order.matchedCount);
    res.status(200).json({
      status: 200,
      data: order,
    });
    client.close();
  } catch (e) {
    res.status(400).json({
      status: 400,
      data: "Unable to retrieve order",
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(APP_DB);
    const orders = await db
      .collection(ORDERS_COLLECTION)
      .find({ customer: userId })
      .toArray();
    assert(orders.length, orders.matchedCount);
    res.status(200).json({
      status: 200,
      data: orders,
    });
    client.close();
  } catch (e) {
    res.status(404).json({
      status: 404,
      data: "No orders found",
    });
  }
};

const placeOrder = async (req, res) => {
  const orderId = ObjectID();
  try {
    const username = req.body.username;
    const items = req.body.items;
    const total = req.body.total;
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(APP_DB);
    const order = await db.collection(ORDERS_COLLECTION).insertOne({
      _id: orderId,
      customer: username,
      items: items,
      total: total,
    });
    assert(1, order.insertedCount);
    res.status(200).json({
      status: 200,
      success: true,
      data: {
        orderId: orderId,
        customer: username,
        items: items,
        total: total,
      },
    });
    client.close();
  } catch (e) {
    res.status(400).json({
      status: 400,
      data: e.message,
    });
  }
};

const updateOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const items = req.body.items;
  const newValues = {
    $set: { items: { ...items }, total: req.body.total },
  };
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(APP_DB);
    const order = await db
      .collection(ORDERS_COLLECTION)
      .updateOne({ _id: ObjectID(orderId) }, newValues);
    assert(1, order.matchedCount);
    assert(1, order.updatedCount);
    res.status(200).json({
      status: 200,
      success: true,
    });
    client.close();
  } catch (e) {
    res.status(400).json({
      status: 400,
      data: "Unable to perform action",
    });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(APP_DB);
    const order = await db
      .collection(ORDERS_COLLECTION)
      .deleteOne({ _id: ObjectID(orderId) });
    assert(1, order.deletedCount);
    res.status(204).json({
      status: 204,
    });
    client.close();
  } catch (e) {
    res.status(400).json({
      status: 400,
      data: "Unable to perform action",
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getOrdersByUserId,
  placeOrder,
  updateOrder,
  deleteOrder,
};
