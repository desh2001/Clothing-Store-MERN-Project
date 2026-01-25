import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res) {
    console.log("Create order request body:", req.body);
    if (req.user == null) {
        return res.status(401).json({ message: "Authentication required" });

    }
    try {
        const latestOrder = await Order.findOne().sort({ date: -1 });

        let orderID = "ORD000001";

        if (latestOrder !== null) {
            let latestOrderID = latestOrder.orderID;
            let latestOrderNumberString = latestOrderID.replace("ORD", "");
            let latestOrderNumber = parseInt(latestOrderNumberString);
            let newOrderNumber = latestOrderNumber + 1;
            orderID = "ORD" + newOrderNumber.toString().padStart(6, '0');

        }
        const items = []
        let total = 0



        // Validate that items is an array to prevent DoS attacks
        if (!Array.isArray(req.body.items)) {
            return res.status(400).json({ message: "Items must be an array" });
        }


        const inputItems = req.body.items;

        // Prevent huge payload DoS
        if (inputItems.length > 100) {
            return res.status(400).json({ message: "Too many items in order (max 100)" });
        }

        for (let i = 0; i < inputItems.length; i++) {
            if (!inputItems[i] || !inputItems[i].productID) {
                return res.status(400).json({ message: `Invalid item structure at index ${i}` });
            }

            const product = await Product.findOne({
                productID: inputItems[i].productID
            })

            if (product == null) {
                return res.status(400).json({
                    message: `Product with ID ${inputItems[i].productID}not found`
                })
            }

            if (product.stock < inputItems[i].quantity) {
                return res.status(400).json({
                    message: `only ${product.stock} items available in stock for product ID ${inputItems[i].productID} `
                })
            }

            items.push({
                productID: product.productID,
                name: product.name,
                price: product.price,
                quantity: inputItems[i].quantity,
                image: product.images[0]
            });
            total += product.price * inputItems[i].quantity;

        }
        let name = req.body.name;
        if (req.body.name == null) {
            name = req.user.firstName + " " + req.user.lastName;
        }
        const newOrder = new Order({
            orderID: orderID,
            email: req.user.email,
            address: req.body.address,
            notes: req.body.notes ?? req.body.note ?? undefined,
            total: total,
            items: items,
            phonenumber: req.body.phonenumber,
            name: name
        })

        await newOrder.save();

        for (let i = 0; i < items.length; i++) {
            await Product.updateOne(
                { productID: items[i].productID },
                { $inc: { stock: -items[i].quantity } })
        }

        return res.json({
            message: "Order created successfully",
            orderID: orderID
        });


    } catch (err) {
        console.error("Create order error:", err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }


}

export async function getOrders(req, res) {
    if (req.user == null) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role === "admin") {
        const orders = await Order.find().sort({ date: -1 });
        return res.json(orders);
    } else {
        const orders = await Order.find({ email: req.user.email }).sort({ date: -1 });
        return res.json(orders);
    }




}

export async function updateOrder(req, res) {
    if (req.user == null || req.user.role !== "admin") {
        return res.status(401).json({ message: "Authentication required" });
    }
    try {
        const orderID = req.params.orderID;
        const status = req.body.status;
        const notes = req.body.notes ?? req.body.note ?? undefined;

        await Order.updateOne(
            { orderID: orderID },
            { $set: { status: status, notes: notes } }
        );
        return res.json({ message: "Order updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}