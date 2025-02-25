// Import Config

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
import { NextFunction, Request, Response } from 'express';
import statusCodes from 'http-status-codes';
const joi = require('@hapi/joi');


const validator = (schema: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        var errors: any = {};
        
        const rules = schema.validate(req) 
        if (rules.error) {
            var error = rules.error.details;
            var firstError: string = error[0].context.key;  

            for (var e of error) {
                let key: string = e.context.key;
                let label: string = e.context.label;
                errors[key] = e.message.replace(/['"]+/g, '').replace('body.', '');
            }
            return res.status(statusCodes.BAD_REQUEST).send({
                status: "error",
                message: errors[firstError],
                errors,
            });
        } else {
            next();
        }
    }
}


const paginationSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        query: joi.object().keys({
            per_page: joi.string().allow(null),
            page: joi.string().allow(null)
        })
})

//
//validation of uuid
//
const uuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        params: joi.object().keys({
            uuid: joi.string().uuid().trim().required()
        })
})

//
//validation of userSubscriptionUuid
//
const userSubscriptionUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        params: joi.object().keys({
            user_subscription_uuid: joi.string().uuid().trim().required()
        })
})

//
//validation of user uuid
//
const userUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        params: joi.object().keys({
            user_uuid: joi.string().uuid().trim().required()
        })
})

//
// get the errors
//
const getErrors = async (rules: any) => {
    var errors: any = {};
    if (rules.error) {

        for (var e of rules.error.details) {
            let key: string = e.context.label;
            errors[key] = e.message.replace(/['"]+/g, '');
        }

    }

    return errors;

}

//
// get the file errors
//
const getFileErrors = async (rules: any) => {
    var errors: any = [];
    if (rules.error) {

        for (var e of rules.error.details) {
            
            let errMessage =  e.message.replace(/['"]+/g, '') + ' on row number ' + (e.path[0]+2);
            
            errors.push(errMessage.split('.')[1]);
            
        }

    }

    return errors;

}

//
//  validation of production uuid
//
const productionUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        params: joi.object().keys({
            production_uuid: joi.string().uuid().trim().required()
        })
})


//
//  validation of production uuid
//
const sequenceUuidSchema = joi.object().options({ abortEarly: false, stripUnknown: true })
    .keys({
        params: joi.object().keys({
            sequence_uuid: joi.string().uuid().trim().required()
        })
})



export { validator,paginationSchema,uuidSchema, userUuidSchema, getErrors, getFileErrors, productionUuidSchema, userSubscriptionUuidSchema, sequenceUuidSchema};



