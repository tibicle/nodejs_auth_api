'use strict'; 
// Import Config
import i18n from "../../../config/i18n";

// Import Static

// Import Middleware

// Import Controllers

// Import Interface
// import { FileInterface } from "../../../interface/FileInterface";

// Import validations
import fileValidator from "../../../helpers/fileValidator.helper";
import userRepo from "../../user/repos/user.repo";

// Import Transformers

// Import Libraries

// Import Repos
import fileRepo from "../repo/file.repo";

// Import Thirdparty
import moment from 'moment-timezone';

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : to save the files to master
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveFile = async (container: any) => { 

    try {

        const {
            input: {
                body,
                params
            },
            derived: {
                files
            }
        } = container;
        
        //
        // validate the derived
        //
        await fileValidator.fileDataValidator(container.derived);

        //
        // save the user files
        //
        await saveUserFiles(container);

        //
        // Get the user by uuid
        //
        container.output.message = i18n.__('file_success');

        return container;

    } catch (error) {

        throw error;

    }

}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : to save the user file data
🗓 @created : 17/07/2023
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const saveUserFiles = async(container:any) => {

    try {
        
        const {
            input: {
                body,
                logged_in_user
            },
            derived: {
                files
            }
        } = container;
        
        //
        // Prepare the model
        //
        const fileData:any = [];
        const output:any = [];
        for(const file of files) {

            let fileModelData:any = {
                name:file.name,
                ref_uuid: null,
                ref_type: null,
                content_type: file.type,
                aws_s3_url: file.url,
                created_at: moment.utc().format('YYYY-MM-DD HH:mm:ss')
            };

            fileData.push(fileModelData);

        }
        
        const fileUuids = await fileRepo.saveFileData(fileData);
        
        for(const [i,file] of files.entries()) {

            let fileObject = {
                ...file,
                uuid: fileUuids[i].uuid
            }

            output.push(fileObject)
            

        }

        console.log(fileUuids);
        
        
        container.output.result = output;
        
        //
        //  save file uuid to user table if user upload profile pic
        //
        if(body.type == "PROFILE_PIC"){

            console.log("inside profile");
            

            //
            //  prepare data model to update the file uuid in user table
            //
            const updateUserFileUuid:any = {

                file_uuid: fileUuids[0].uuid
                
            }

            //
            //  update the file uuid into user table
            //
            await userRepo.updateUserByUuid(logged_in_user.uuid,updateUserFileUuid);

            //
            //  update the file table with ref uuid and ref type
            //
            const updateFileData = {

                ref_uuid: logged_in_user.uuid,
                ref_type: "PROFILE_PIC"

            }

            await fileRepo.updateFiledata(fileUuids[0].uuid,updateFileData);

        }

        return container;

    } catch (error) {

        throw error;

    }

}
export default saveFile;