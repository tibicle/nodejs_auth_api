import AWS from 'aws-sdk'
import config from './constant';

AWS.config.update({ 
  secretAccessKey: `${config.app.AWS_SECRET_ACCESS_KEY}`,
  accessKeyId: `${config.app.AWS_ACCESS_KEY}`,
  region: `${config.app.AWS_BUCKET_REGION}`,
  signatureVersion: 'v4'
});

const S3:AWS.S3 = new AWS.S3();

export default S3;