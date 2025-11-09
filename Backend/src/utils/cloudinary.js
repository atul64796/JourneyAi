import {v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// upload avatar and coverimage to cloudinary
const uploadOnCloudinary = async (localFilePath) =>{
    try {
     if(!localFilePath) return null;
     const response = await cloudinary.uploader.upload(localFilePath,{
        resources_type: 'auto',
     });
     // remove file from local uploads folder
     console.log('file uploaded to cloudinary successfully', response.url);
     // remove file from public temp folder 
     fs.unlinkSync(localFilePath);
        return response;   
    } catch (error) {
        // remove the locally saved temp file from public folder in case of error
        fs.unlinkSync(localFilePath);
        console.error('Error uploading file to cloudinary', error);
        return null;
        }
} 
  export {uploadOnCloudinary}; 
