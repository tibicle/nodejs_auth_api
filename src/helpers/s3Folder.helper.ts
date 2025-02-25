// Import Config
import config from "../config/constant";

// Import Static

// Import Middleware

// Import Controllers

// Import Helpers

// Import Transformers

// Import Libraries

// Import Models
import companyRepos from '../app/company/repos/company.repos';
import userRepo from '../app/user/repos/user.repo';

// Import Thirdparty

class S3Folder {

   /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Bhavya Nayak
   🚩 @uses : get the library folder path
   🗓 @created : 28/03/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
    async getFolderPath(companyUuid:any , userUuuid:any , name:any , ) {

        try {

           if(companyUuid){

                //
                //  get company details by uuid
                //
                const companyDetails = await companyRepos.checkCompanyExists(companyUuid);

                //
                //  get user details by uuid
                //
                const userDetails = await userRepo.getUserByUuid(userUuuid);

                const companyUuidFile = companyDetails.uuid.replace(/-/g,'_');

                const userUuidFile = userDetails.uuid.replace(/-/g,'_');

                // if(companyDetails.name.includes(" ")){

                // var companyName = companyDetails.name.replace(/\s/g, '');

                // }else{

                var companyName = config.folder_prefix.COMPANY

                // }  
                
                let folderName;

                if(name !==null){

                    folderName = name.split(".");
                    
                }

                //
                //  create folder structure and return the file name
                //
                let  fileName = name!==null ? `${companyName}_${companyUuidFile}/${config.folder.LIBRARY}/${config.folder_prefix.USER}_${userUuidFile}/${folderName[0]}` : null;

                return fileName;

           }else{

                //
                //  get user details by uuid
                //
                const userDetails = await userRepo.getUserByUuid(userUuuid);

                const userUuidFile = userDetails.uuid.replace(/-/g,'_');

                let folderName;
                
                if(name !==null){

                    folderName = name.split(".");
                    
                }
                
                //
                //  create folder structure and return the file name
                //
                var fileName = name!==null ? `${config.folder_prefix.USER}_${userUuidFile}/${config.folder.LIBRARY}/${folderName[0]}` : null;

                return fileName;
           }

            

        } catch (error) {

            throw error;

        }

    }

   /*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Bhavya Nayak
   🚩 @uses : get production folder path
   🗓 @created : 28/03/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
   async getProductionFolderPath(companyUuid:any , userUuuid:any , name:any , productionDetails:any) {

    try {

       if(companyUuid){

            //
            //  get company details by uuid
            //
            const companyDetails = await companyRepos.checkCompanyExists(companyUuid);

            const companyUuidFile = companyDetails.uuid.replace(/-/g,'_');

            // if(companyDetails.name.includes(" ")){

            // var companyName = companyDetails.name.replace(/\s/g, '');

            // }else{

            // var companyName = companyDetails.name

            // }

            var companyName = config.folder_prefix.COMPANY

            const productionUuidFile = productionDetails.uuid.replace(/-/g,'_');

            // if(productionDetails.name.includes(" ")){

            // var productionName = productionDetails.name.replace(/\s/g, '');

            // }else{

            // var productionName = productionDetails.name

            // }

            var productionName = config.folder_prefix.PRODUCTION

            //
            //  create folder structure and return the file name
            //
            var fileName = `${companyName}_${companyUuidFile}/${config.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${config.folder.EXPORT}/${name}`

       }else{

            //
            //  get user details by uuid
            //
            const userDetails = await userRepo.getUserByUuid(userUuuid);

            const userUuidFile = userDetails.uuid.replace(/-/g,'_');

            const productionUuidFile = productionDetails.uuid.replace(/-/g,'_');

            // if(productionDetails.name.includes(" ")){

            // var productionName = productionDetails.name.replace(/\s/g, '');

            // }else{

            // var productionName = productionDetails.name

            // }

            var productionName = config.folder_prefix.PRODUCTION

            //
            //  create folder structure and return the file name
            //
            var fileName = `${config.folder_prefix.USER}_${userUuidFile}/${config.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${config.folder.EXPORT}/${name}`

       }

        return fileName;

    } catch (error) {

        throw error;

    }

}

/*
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   👑 @creator : Sushant Shekhar
   🚩 @uses : get hls folder path
   🗓 @created : 06/12/2024
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
   async getHlsFolderPath(companyUuid:any , userUuuid:any , exportUuid:any , productionDetails:any) {

    try {

       if(companyUuid){

            //
            //  get company details by uuid
            //
            const companyDetails = await companyRepos.checkCompanyExists(companyUuid);

            const companyUuidFile = companyDetails.uuid.replace(/-/g,'_');

            var companyName = config.folder_prefix.COMPANY

            const productionUuidFile = productionDetails.uuid.replace(/-/g,'_');

            var productionName = config.folder_prefix.PRODUCTION

            //
            //  create folder structure and return the file name
            //
            var fileName = `${companyName}_${companyUuidFile}/${config.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${config.folder.EXPORT}/${config.folder.OUTPUT_HLS}_${exportUuid}`

       }else{

            //
            //  get user details by uuid
            //
            const userDetails = await userRepo.getUserByUuid(userUuuid);

            const userUuidFile = userDetails.uuid.replace(/-/g,'_');

            const productionUuidFile = productionDetails.uuid.replace(/-/g,'_');

            var productionName = config.folder_prefix.PRODUCTION

            //
            //  create folder structure and return the file name
            //
            var fileName = `${config.folder_prefix.USER}_${userUuidFile}/${config.folder.PRODUCTION}/${productionName}_${productionUuidFile}/${config.folder.EXPORT}/${config.folder.OUTPUT_HLS}_${exportUuid}`

       }

        return fileName;

    } catch (error) {

        throw error;

    }

}

}

export default new S3Folder()