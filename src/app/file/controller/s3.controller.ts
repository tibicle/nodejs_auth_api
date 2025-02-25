// Import Config

// Import Static

// Import Middleware

// Import Services
import saveFile from '../services/saveFile.service';

// Import Helpers
import responseHelper from '../../../helpers/response.helper';

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import { NextFunction, Response } from 'express';
import StatusCodes from 'http-status-codes';

class s3Controller {

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : to upload file to s3 bucket
    🗓 @created : 25/02/2025
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async uploadFiletoS3(req: any, res: Response, next: NextFunction) {

        try {

            const container:any = {
                input: {
                    body: req.body,
                    query: req.query,
                    params: req.params,
                    logged_in_user: req.logged_in_user
                },
                derived: {},
                output: {
                    result:{}
                }
            }
            
            container.derived.files = [];
            container.derived.files = req.files.map((file:any) => {
                return { 
                    url: file.location, 
                    name: file.key, 
                    type: file.mimetype
                };
            });
            
            //
            // save the files service
            //
            await saveFile(container);

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error:any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }

    }

}

export default new s3Controller();