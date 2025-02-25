// Import Joi
import joi from "joi";

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : create file schema for body validation
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const fileSchema = {
    
    //
    //  body validation for upload file API
    //
    uploadFile: joi.object().options({ abortEarly: false, stripUnknown: true })
        .keys({
            query: joi.object().keys({
                type: joi.string().required(),
                upload_type: joi.string().required()
            })
        })
    
}

export default fileSchema;