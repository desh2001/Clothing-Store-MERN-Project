import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const sampleProducts = [
    {
        productID: "P001",
        name: "Classic White T-Shirt",
        altNames: ["White Tee", "Basic Cotton Shirt"],
        description: "A comfortable, 100% cotton white t-shirt perfect for everyday wear.",
        price: 1500,
        labelledPrice: 2000,
        modelNumber: "TS-WHT-01",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80"],
        category: "T-Shirts",
        brand: "Generic",
        stock: 50,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White"]
    },
    {
        productID: "P002",
        name: "Blue Denim Jeans",
        altNames: ["Denim Pants", "Blue Jeans"],
        description: "High-quality denim jeans with a slim fit cut.",
        price: 4500,
        labelledPrice: 5500,
        modelNumber: "JN-BLU-02",
        images: ["https://images.unsplash.com/photo-1542272617-08f086303294?auto=format&fit=crop&w=500&q=80"],
        category: "Jeans",
        brand: "Levi's Style",
        stock: 30,
        sizes: ["28", "30", "32", "34"],
        colors: ["Blue"]
    },
    {
        productID: "P003",
        name: "Floral Summer Dress",
        altNames: ["Summer Frock", "Floral Dress"],
        description: "Lightweight and breezy floral dress for hot summer days.",
        price: 3200,
        labelledPrice: 4000,
        modelNumber: "DR-FLR-03",
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80"],
        category: "Dresses",
        brand: "FashionHub",
        stock: 20,
        sizes: ["S", "M", "L"],
        colors: ["Pink", "Multi"]
    },
    {
        productID: "P004",
        name: "Black Hoodie",
        altNames: ["Black Sweatshirt", "Hooded Jumper"],
        description: "Cozy black hoodie made from fleece material.",
        price: 3800,
        labelledPrice: 5000,
        modelNumber: "HD-BLK-04",
        images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80"],
        category: "Hoodies",
        brand: "StreetWear",
        stock: 40,
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Black"]
    }
];

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to database...");

        // Loop through and upsert products (update if exists, insert if new)
        for (const product of sampleProducts) {
            await Product.findOneAndUpdate(
                { productID: product.productID },
                product,
                { upsert: true, new: true }
            );
            console.log(`Processed: ${product.name}`);
        }

        console.log("Seeding complete!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error seeding database:", err);
        process.exit(1);
    });
