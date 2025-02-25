"use strict";
// 'use strict';
// // Import Config
// import restApiService from "../../../resources/http/restApi.service";
// // Import Repos
// // Import Thirdparty
// /*
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 👑 @creator : Sushant Shekhar
// 🚩 @uses : check embed code exist or not.
// 🗓 @created : 04/09/2024
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// */
// const getHlsSnsNotificationService = async (container: any) => {
//     try {
//         const {
//             input: {
//                 body,
//                 params,
//                 query,
//                 logged_in_user
//             }
//         } = container;
//         if(container.derived.jobId && container.derived.status == 'COMPLETE'){
//             //
//             // Remove the prefix
//             //
//             const file_url = container.derived.hlsFile.split('/').pop();
//             const hlsFileModel = {
//                 embed_hls_file_name: file_url,
//                 hls_status: 'COMPLETED'
//             }
//             //
//             //  update model in db
//             //
//             await restApiService.updateHlsStatus(hlsFileModel,container.derived.jobId)
//         }else{
//             if(container.derived.status == 'ERROR'){
//             //
//             //  Hls Error model
//             //
//             const hlsErrorModel = {
//                 hls_error: container.derived.errorMessage,
//                 hls_status: 'FAILED'
//             }
//             //
//             //  update model in db
//             //
//             await restApiService.updateHlsStatus(hlsErrorModel,container.derived.jobId)
//             }
//         }  
//         return container;
//     } catch (error) {
//         throw error;
//     }
// };
// export default getHlsSnsNotificationService;
//# sourceMappingURL=getHlsNotification.service.js.map