"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permission = {
    masters: {
        dashboard: {
            create: "add_dashboard",
            read: "read_dashboard",
            update: "update_dashboard"
        }
    },
    staff_management: {
        staff: {
            create: "add_staff",
            read: "read_staff",
            update: "update_staff"
        }
    },
    subscription_management: {
        subscription: {
            create: "create_subscription",
            read: "read_subscription",
            update: "update_subscription"
        }
    },
    organization_management: {
        organization: {
            create: "add_organization",
            read: "read_organization",
            update: "update_organization",
            delete: "delete_organization"
        }
    },
    production_management: {
        production: {
            create: "create_production",
            read: "read_production",
            update: "update_production",
            delete: "delete_production"
        }
    },
    library_management: {
        library: {
            create: "add_library",
            read: "read_library",
            update: "update_library",
            delete: "delete_library"
        }
    },
    tutorial_management: {
        tutorial: {
            create: "add_tutorial",
            read: "read_tutorial",
            update: "update_tutorial",
            delete: "delete_tutorial",
            publish: "publish_tutorial"
        }
    },
    module_management: {
        module: {
            create: "add_module",
            read: "read_module",
            update: "update_module",
            delete: "delete_module",
            publish: "publish_module"
        }
    },
    error_log_management: {
        error_log: {
            create: "add_error_log",
            read: "read_error_log",
            update: "update_error_log",
            delete: "delete_error_log"
        }
    },
    team_management: {
        team: {
            create: "create_team",
            read: "read_team",
            update: "update_team",
            delete: "delete_team"
        }
    }
};
exports.default = permission;
//# sourceMappingURL=permission.js.map