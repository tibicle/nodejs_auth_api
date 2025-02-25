import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3 from './clientS3';
// import { S3Client } from '@aws-sdk/client-s3'
import config from './constant';

// //const S3:aws.S3 = new aws.S3();
// const s3 = new S3Client({
//   region:'us-east-1',
//   credentials: {
//     secretAccessKey: `${config.app.AWS_SECRET_ACCESS_KEY}`,
//     accessKeyId: `${config.app.AWS_ACCESS_KEY}`,
//   }
// });



// CREATE MULTER FUNCTION FOR UPLOAD
let fileUpload: any = multer({
    // CREATE MULTER-S3 FUNCTION FOR STORAGE

    storage: multerS3({
        s3: s3,
        acl: 'private',

        // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
        bucket: `${config.app.AWS_BUCKET_NAME}`,
        // contentType: multerS3.AUTO_CONTENT_TYPE,

        // META DATA FOR PUTTING FIELD NAME
        metadata: function (req, file, cb) {

            cb(null, { fieldName: file.fieldname });
        },

        // SET / MODIFY ORIGINAL FILE NAME
        key: function (req, file, cb) {

            //cb(null, file.originalname); //set unique file name if you wise using Date.toISOString()
            // EXAMPLE 1

            const fileName = (file.originalname).replace(/\s/g, "_");

            cb(null, Date.now() + '_' + fileName);
            // EXAMPLE 2
            // cb(null, new Date().toISOString() + '-' + file.originalname);

        }

    }),


    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function (req, file, cb: any) {
        const filetypes = /jpeg|jpg|png|heic|heif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Allow images only of extensions jpeg|jpg|png|heic|heif !");
        }
    }
});


export default fileUpload;