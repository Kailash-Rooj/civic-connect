let cloudinary = null;
try { cloudinary = require("cloudinary").v2; } catch (_) { /* install dependency before image uploads */ }
function configured() { return Boolean(cloudinary && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET); }
function setup() { if (!cloudinary) return; cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET }); }
function uploadBuffer(buffer, folder) { return new Promise((resolve,reject)=>{ if(!configured()) return reject(new Error("Cloudinary is not configured")); setup(); const stream=cloudinary.uploader.upload_stream({folder,resource_type:"image"},(error,result)=>error?reject(error):resolve(result)); stream.end(buffer); }); }
module.exports={configured,uploadBuffer};
