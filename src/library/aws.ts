// Import Config
import config from "../config/constant";
import s3 from '../config/awsS3';

// Import Static

// Import Middleware

// Import Controllers

// Import Interface

// Import Validators

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import fs from "fs-extra";

class Aws {

    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to check the permission agaist user and action code
    * 🗓 Created : 23/4/2022
    */
    async getSignedUrl(bucket: string, key: string) {

        try {

            const url = await s3.getSignedUrl('getObject', {
                Bucket: bucket,
                Key: key,
                Expires: 3600,
                ResponseContentType: 'application/pdf',
                ResponseContentDisposition: 'attachment'
            });

            return url;

        } catch (error) {

            throw error;

        }

    }

    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to delete the file from s3
    * 🗓 Created : 27/6/2022
    */
    async deleteFile(bucket: string, key: string) {

        try {

            var params = { Bucket: bucket, Key: key };

            //
            // delete the object
            //
            const data = await s3.deleteObject(params).promise();

            return data;

        } catch (error) {

            console.log(error);
            throw error;

        }

    }

    /*============================
    😎 @author: Henil Mehta
    🚩 @uses: upload base64 image to s3
    🗓 @created: 15/09/2022
    ============================*/
    async uploadBase64Image(bucket: string, key: string, base64EncodedImage: string, extension: string) {

        try {

            //
            // upload the file
            //
            const uploadedFile = await s3.upload({
                Bucket: bucket,
                Key: key,
                Body: base64EncodedImage,
                ContentType: `image/${extension}`,
                ContentEncoding: "base64"
            }).promise();

            return uploadedFile;

        } catch (error: any) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to upload pdf in s3 bucket
    🗓 @created : 02/08/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async uploadPDFToS3(bucket: string, key: string, filePath: any) {

        try {
            
            const fileContent = fs.readFileSync(filePath);
            
            const pdfFile = await s3.upload({
                    Bucket: bucket,
                    Key: key, // The file name to be used in the S3 bucket
                    Body: fileContent,
                    ContentType: 'application/pdf', // Set the appropriate content type
                    ACL: 'public-read' // Set the access control policy (optional)
                }).promise();
                
            return pdfFile;

        } catch (error: any) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get pre signed url to upload file
    🗓 @created : 09/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getPreSignedUrl(bucket: string, key: any, type:any) {

        try {

            // Get signed URL from S3
            const s3Params = {
                Bucket: bucket,
                Key: key,
                Expires: parseInt(`${config.expiration_time.PRE_SIGNED_URL}`),
                ContentType: type
            }
            
            let uploadURL = s3.getSignedUrl('putObject', s3Params)
            
            return uploadURL;

        } catch (error) {
            
            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get signed url
    🗓 @created : 08/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getImageSignedUrl(key: string) {

        try {

            const s3Params = {
                Bucket: `${config.app.AWS_BUCKET_NAME}`,
                Key: key,
                Expires: 36000
            }
    
            let uploadURL = s3.getSignedUrl('getObject', s3Params)

            return uploadURL;

        } catch (error:any) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : check and create folder
    🗓 @created : 21/03/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async checkAndCreateFolder(bucket:any, folder:any) {

        try {

            const folderExists = await s3.headObject({ Bucket: bucket, Key: folder }).promise().then(() => true).catch(() => false);

            if (!folderExists) {

                await s3.putObject({ Bucket: bucket, Key: folder }).promise();

            }

            // Define the key with the folder path and filename
            const key = `${folder}`;

            return key;

        } catch (error:any) {

            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : delete folder from s3
    🗓 @created : 09/05/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async deleteFolder(bucket: string, key: string) {

        try {

            let isTruncated = true;
            let continuationToken = null;

            // const params = {
            //     Bucket: bucket,
            //     Prefix: key
            // };

            // const data:any = await s3.listObjectsV2(params).promise();

            // const objects = data.Contents.map((obj:any) => ({ Key: obj.Key }));
 
            // if (objects.length === 0) {
            //     console.log('Folder is already empty.');
            //     return;
            // }
    
            // const deleteParams = {
            //     Bucket: bucket,
            //     Delete: { Objects: objects }
            // };
    
            // const deleteData:any = await s3.deleteObjects(deleteParams).promise();
            // console.log(`${deleteData.Deleted.length} objects deleted from folder: ${key}`);
            // return true

            while (isTruncated) {

                const params:any = {
                    Bucket: bucket,
                    Prefix: key,
                    ContinuationToken: continuationToken // For pagination
                };
    
                const data:any = await s3.listObjectsV2(params).promise();
    
                if (!data.Contents || data.Contents.length === 0) {
                    console.log('Folder is already empty.');
                    return false; // Indicate folder is already empty
                }
    
                const objects = data.Contents.map((obj:any) => ({ Key: obj.Key }));
    
                const deleteParams = {
                    Bucket: bucket,
                    Delete: { Objects: objects }
                };
    
                const deleteData:any = await s3.deleteObjects(deleteParams).promise();

                console.log(`${deleteData.Deleted.length} objects deleted from folder: ${key}`);
    
                // Check for more objects
                isTruncated = data.IsTruncated;
                continuationToken = data.NextContinuationToken; // For next batch
                
            }
    
            return true;

        } catch (error) {

            console.log(error);
            throw error;

        }

    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : check folder exist or not
    🗓 @created : 02/01/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async doesFolderExist (bucket:string, folder:string) {
        
        if (!folder.endsWith('/')) {
            folder += '/';
        }
    
        const params = {
            Bucket: bucket,
            Prefix: folder,
            MaxKeys: 1, 
        };
    
        try {
           
            const data = await s3.listObjectsV2(params).promise();
          
            return data.Contents && data.Contents.length > 0;

        } catch (error) {
            console.error("Error checking folder existence:", error);
           
        }
    };

    
    
}

export default new Aws();