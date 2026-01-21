import { useState } from "react";


export default function Test(){
    const [file,setFile]=useState(null);

    async function handleUpload(){
        const url = await uploadFile(file);
        console.log("File uploaded to:", url);
        }
    return(
        <div className="w-full h-full flex justify-center items-center">
            <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded ml-4">Upload</button>
        </div>

    )

}