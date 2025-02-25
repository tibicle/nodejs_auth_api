"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import validations
// Import Transformers
// Import Libraries
// Import Repos
const organization_repo_1 = __importDefault(require("../repos/organization.repo"));
const subscription_repo_1 = __importDefault(require("../../subscription/repo/subscription.repo"));
/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
👑 @creator : Bhavya Nayak
🚩 @uses : get staff details by uuid service
🗓 @created : 23/02/2024
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
const getOrganizationDetails = (container) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { input: { body, logged_in_user, params } } = container;
        //
        //  check organization exists or not
        //
        yield organization_repo_1.default.checkOrganizationByUuid(params.uuid);
        //
        //  get current active plan of company
        //
        const subscriptionDetail = yield subscription_repo_1.default.getCompanyActiveSubscriptionDetailsByCompanyUuid(params.uuid);
        //
        //  organization details
        //
        const companyDetails = yield organization_repo_1.default.getOrganizationDetailsByUuid(params.uuid);
        if (companyDetails) {
            //
            //  add current plan
            //
            companyDetails.current_plan = subscriptionDetail ? subscriptionDetail.plan_name : null;
        }
        else {
            companyDetails.current_plan = null;
        }
        //
        //  get staff details
        //
        container.output.result = companyDetails;
        return container;
    }
    catch (error) {
        throw error;
    }
});
exports.default = getOrganizationDetails;
//# sourceMappingURL=getOrganizationDetailsByUuid.service.js.map