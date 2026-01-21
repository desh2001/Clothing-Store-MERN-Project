import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillProduct } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import uploadFile from '../../lib/mediaUpload';

export default function AdminAddProductPage() {
        const [ProductID, setProductID] = useState("");
        const[name,setName]=useState("");
        const[altNames,setAltNames]=useState("");
        const[description,setDescription]=useState("");
        const[price,setPrice]=useState(0);  
        const[labelledPrice,setLabelledPrice]=useState(0);
        const[modelNumber,setModelNumber]=useState("standard");
        const[files,setFiles]=useState([]);
        const[category,setCategory]=useState("");
        const[brand,setBrand]=useState("Generic");
        const[stock,setStock]=useState(0);  
        const[isAvailable,setIsAvailable]=useState(true);
        const navigate = useNavigate();
        
    async function addProduct() {
        const token = localStorage.getItem("token");

        if(token == null){
            toast.error("You must be logged in to add a product");
            navigate("/login");
            return;
        }

        const imagePromises = []
        for(let i=0 ; i<files.length ; i++){
            const promise = uploadFile(files[i]);
            imagePromises.push(promise);
        }
        const imagesArray = await Promise.all(imagePromises).catch((error)=>{
            console.error("Image upload failed:", error);
            toast.error("Image upload failed");
        });

        

        if(ProductID == "" || name =="" || description =="" || category =="" || brand =="" || modelNumber ==""){
            toast.error("Please fill in all required fields");
            return;
        }

        try{
            const altnamesArray = altNames ? altNames.split(",").map(s=>s.trim()).filter(Boolean) : [];
         
            // `imagesArray` is produced above from uploaded files; use that instead of a non-existent `images` variable.
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/products/" , {
                    productID : ProductID,
                    name : name,
                    altNames : altnamesArray,
                    description : description,
                    price : Number(price),  
                    labelledPrice : Number(labelledPrice),  
                    modelNumber : modelNumber,
                    images : imagesArray,
                    category : category,
                    brand : brand,
                    stock : Number(stock),
                    isAvailable : isAvailable
            },{
                headers: { Authorization: `Bearer ${token}` }
            }).then((response)=>{
                toast.success("Product added successfully");
                navigate("/admin/products");
            })   
        
    }
    catch(error){
        console.error("Add product failed:", error);
        toast.error(error?.response?.data?.message || "Failed to add product");
    }   
    }
    return (
        <div className="w-full h-full flex flex-col items-center p-[50px] overflow-y-scroll">
            <div className="w-[700px] bg-black/80 rounded-2xl p-[40px]">
                <h1 className="w-full text-xl text-primary mb-[20px] flex items-center gap-2">
                    <AiFillProduct />Add New Product</h1>
                <div className="w-full bg-white p-[20px] rounded-2xl flex  flex-wrap justify-between">
                    <div className="my-[10px] w-[45%]">
                        <label className="text-black font-bold">Product ID</label>
                        <input type="text" className="w-full border-[2px] mt-[10px] p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={ProductID} onChange={(e)=>setProductID(e.target.value)} />
                        <p className="text-gray-500 w-full  text-right text-sm">Unique identifier for the product</p>
                    </div>
                    <div className="my-[10px] w-[45%]">
                        <label className="text-black font-bold">Product Name</label>
                        <input type="text" className="w-full border-[2px] mt-[10px] mb-[20px] p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={name} onChange={(e)=>setName(e.target.value)} />
                    </div>
                    <div className="my-[10px] w-full"  >
                        <label className="text-black font-bold">Altenative Names</label>
                        <input type="text" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={altNames} onChange={(e)=>setAltNames(e.target.value)} />
                        <p className="text-gray-500 w-full  text-right text-sm">Separate names with commas</p>
                    </div>
                    <div className="my-[10px] w-full"  >
                        <label className="text-black font-bold">Description</label>
                        <textarea type="text" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={description} onChange={(e)=>setDescription(e.target.value)} />
                    </div>
                    <div className="my-[10px] w-[45%]"  >
                        <label className="text-black font-bold">Price</label>
                        <input type="number" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={price} onChange={(e)=>setPrice(e.target.value)} />
                    </div>
                    <div className="my-[10px] w-[45%]"  >
                        <label className="text-black font-bold">Label Price</label>
                        <input type="number" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={labelledPrice} onChange={(e)=>setLabelledPrice(e.target.value)} />
                    </div>
                  
                    <div className="my-[10px] w-full"  >
                        <label className="text-black font-bold">Images</label>
                        <input type="file" multiple={true} className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " onChange={(e)=>setFiles(e.target.files)} />
                    </div>
                    <div className="my-[10px] w-[30%]"  >
                        <label className="text-black font-bold">Categories</label>
                        <select className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={category} onChange={(e)=>setCategory(e.target.value)} >
                            <option value="">Select Category</option>
                            <option value="cpu">CPU</option>
                            <option value="gpu">GPU</option>
                            <option value="motherboard">Motherboard</option>
                            <option value="ram">RAM</option>
                            <option value="storage">Storage</option>
                            <option value="psu">Power Supply Unit</option>
                            <option value="case">Case</option>
                            <option value="cooling">Cooling</option>
                            <option value="accessories">Accessories</option>
                            <option value="laptop">LapTop</option>
                        </select>
                 
                    </div>
                   <div className="my-[10px] w-[30%]"  >
                        <label className="text-black font-bold">Brand</label>
                        <input type="text" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={brand} onChange={(e)=>setBrand(e.target.value)} />
                        <p className="text-gray-500 w-full  text-right text-sm">Separate names with commas</p>
                    </div>
                      <div className="my-[10px] w-[30%]"    >
                        <label className="text-black font-bold">Model Number</label>
                        <input type="text" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={modelNumber} onChange={(e)=>setModelNumber(e.target.value)} />
                    </div>
                    <div className="my-[10px] w-[45%]"  >
                        <label className="text-black font-bold">Stock</label>
                        <input type="number" className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={stock} onChange={(e)=>setStock(e.target.value)} />
                    </div>
                    <div className="my-[10px] w-[45%]"  >
                        <label className="text-black font-bold">Availability</label>
                        <select className="w-full border-[2px] mt-[10px]  p-[10px] focus:outline none focus:ring-2 focus:ring-black rounded-xl px-[20px] " value={isAvailable} onChange={(e)=>setIsAvailable(e.target.value === 'true')} >
                            <option value={true}>Available</option>
                            <option value={false}>Not Available</option>
                        </select>
                    </div>
                    <div className="w-full flex flex-col items-center mt-[20px]">
                        <Link to="/admin/products" className="w-full text-center bg-red-600 text-white font-bold p-[15px] rounded-2xl mt-[20px] hover:bg-white hover:text-accent transition-colors duration-300">Cancel</Link>
                        <button onClick={addProduct} className="w-full bg-accent text-white font-bold p-[15px] rounded-2xl mt-[20px] hover:bg-white hover:text-accent transition-colors duration-300">Add Product</button>
                    </div>
                </div>
                
                   
               

            </div>
        </div>    
);
}