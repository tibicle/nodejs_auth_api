// Import Config
import config from '../../../config/constant'
import i18n from '../../../config/i18n';

// Import Static

// Import Middleware
import passportAuth from '../../../middleware/passportAuth';
import authorization from '../../../middleware/authorization';

// Import services
import AuthHelper from '../helper/auth.helper';
import signupServices from '../services/signup.services';
import forgetUserPassword from '../services/forgetPassword.service';
import resetUserPassword from '../services/resetPassword.sevice';
import changePasswordService from '../services/changePassword.service';

// Import Helpers
import responseHelper from '../../../helpers/response.helper';

// Import Transformers

// Import Libraries

//Repo
import userRepo from '../../user/repos/user.repo';

// Import Thirdparty
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class AuthController {

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : Signup API
    🗓 @created : 16/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async signup(req: any, res: Response, next: NextFunction) {

        try {

            const container: any = {
                input: {
                    body: req.body
                },
                derived: {},
                output: {
                    result: {}
                }
            }

            //
            //  Store the data in database
            //
            await signupServices(container)

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : login API
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async login(req: any, res: Response, next: NextFunction) {

        try {

            const container: any = {
                input: {
                    body: req.body,
                    params: req.params,
                    headers: req.headers
                },
                derived: {},
                output: {
                    result: {}
                }
            }

            //
            // login the user based on passport Auth
            //
            await passportAuth.loginUser(req, container);

            //
            // validate the login
            //
            await authorization.validateLogin(container);

            //
            // Prepare the Payload for accessToken
            //
            container.output.result.access_token = await AuthHelper.generateAccessToken(container);

            //
            //  Prepare the Payload for refreshToken
            //
            container.output.result.refresh_token = await AuthHelper.generateRefreshToken(container);

            container.output.result.user = await userRepo.getUserByUuid(container.derived.user.uuid)

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Bhavya Nayak
    🚩 @uses : return refresh token and access token
    🗓 @created : 29/09/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async getTokens(req: any, res: Response, next: NextFunction) {

        try {

            const container: any = {
                input: {
                    logged_in_user: req.logged_in_user,
                    session_uuid: req.session_uuid
                },
                derived: {},
                output: {
                    result: {}
                }
            }


            //
            // Prepare the Payload for accessToken
            //
            container.output.result.access_token = await AuthHelper.generateAccessToken(container);

            //
            //  Prepare the Payload for refreshToken
            //
            container.output.result.refresh_token = await AuthHelper.generateRefreshToken(container);

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : forget password API
    🗓 @created : 23/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async forgetPassword(req: any, res: Response, next: NextFunction) {

        try {

            const container: any = {
                input: {
                    body: req.body,
                    params: req.params,
                    logged_in_user: req.logged_in_user
                },
                derived: {},
                output: {
                    result: {}
                }
            }

            //
            //  forget password service
            //
            await forgetUserPassword(container);

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : reset password API
    🗓 @created : 23/10/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async reset(req: any, res: Response, next: NextFunction) {

        try {

            const container: any = {
                input: {
                    body: req.body,
                    params: req.params,
                    logged_in_user: req.logged_in_user
                },
                derived: {},
                output: {
                    result: {}
                }
            }

            //
            //  reset password service
            //
            await resetUserPassword(container);

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }
    }

    /*
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    👑 @creator : Sushant Shekhar
    🚩 @uses : change password API
    🗓 @created : 09/11/2023
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    */
    async changePassword(req: any, res: Response, next: NextFunction) {

        try {

            const container: any = {
                input: {
                    body: req.body,
                    logged_in_user: req.logged_in_user,
                    session_uuid: req.session_uuid
                },
                derived: {},
                output: {
                    result: {}
                }
            }

            //
            //change password service
            //
            await changePasswordService(container)

            //
            // send the response
            //
            res.status(StatusCodes.OK).json(await responseHelper.successResponse(container.output));

        } catch (error: any) {

            res.status(await responseHelper.getStatusCode(error))
                .json(await responseHelper.validationErrorResponse(error));

        }
    }

}
export default new AuthController();