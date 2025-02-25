// Import Config

// Import Static

// Import Middleware

// Import Controllers

// Import Helpers
import { getErrors } from './validator.helper';
import responseHelper from './response.helper';

// Import Transformers

// Import Libraries

// Import Models

// Import Thirdparty
const joi =  require('@hapi/joi')

class FileValidator {

    /*
    * 😎 @author : Raj Jagani
    * 🚩 @uses : to validate the user uploaded file object
    * 🗓 Created : 16/6/2022
    */
    async fileDataValidator(files:any) {

        try {

            const rules = await joi.object().options({ abortEarly: false }).keys({
                files: joi.array().items({
                    url: joi.string().required().trim(),
                    name: joi.string().required().trim(),
                    type: joi.string().required().trim()
                }).required().min(1)
            }).validate(files);
    
            const errors:any = await getErrors(rules);
            
            if (Object.keys(errors).length) {

                await responseHelper.getValidationError(errors);
            
            }

        } catch (error) {

            throw error;

        }

    }

   

}

export default new FileValidator()