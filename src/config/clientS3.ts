import { S3Client } from '@aws-sdk/client-s3'
import config from './constant';

//const S3:aws.S3 = new aws.S3();
const s3:any = new S3Client({
  region: `${config.app.AWS_BUCKET_REGION}`,
  credentials: {
    secretAccessKey: `${config.app.AWS_SECRET_ACCESS_KEY}`,
    accessKeyId: `${config.app.AWS_ACCESS_KEY}`,
  }
});

export default s3;