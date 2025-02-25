// Import Config

// Import services
import getUser from "../services/getUser.service";

// Import Middleware

// Import Controllers

// Import Helpers
import responseHelper from '../../../helpers/response.helper';

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class UserController {
   
    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : get user profile API
    🗓 @created : 25/02/2024
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getMe(req: any, res: Response, next: NextFunction) {

        try {

            const container = {
                input: {
                    body: req.body,
                    params: {
                        uuid: req.logged_in_user.uuid
                    },
                    query: req.query,
                    logged_in_user: req.logged_in_user
                },
                derived: {},
                output: {
                    result: {}
                }
            }
            
            //
            // get the user data
            //
            await getUser(container);

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error)).json(await responseHelper.validationErrorResponse(error));

        }
    }

}

export default new UserController();
