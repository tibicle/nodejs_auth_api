"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultPermission = {
    role_permission: {
        user: [
            'add_dashboard',
            'read_dashboard',
            'update_dashboard',
            'add_library',
            'read_library',
            'update_library',
            'delete_library',
            'create_production',
            'read_production',
            'update_production',
            'delete_production',
            'create_subscription',
            'read_subscription',
            'update_subscription',
            'add_organization',
            'read_organization',
            'update_organization',
            'delete_organization',
            'read_tutorial',
            'read_module'
        ],
        team_manager: [
            'create_team',
            'read_team',
            'update_team',
            'add_organization',
            'read_organization',
            'update_organization',
            'delete_organization'
        ],
        team_owner: [
            'create_team',
            'read_team',
            'update_team',
            'delete_team',
            'add_organization',
            'read_organization',
            'update_organization',
            'delete_organization'
        ],
        team_member: [
            'read_team'
        ],
        VF_admin_content_manager: [
            'add_dashboard',
            'read_dashboard',
            'update_dashboard',
            'add_tutorial',
            'read_tutorial',
            'update_tutorial',
            'add_module',
            'read_module',
            'update_module'
        ],
        VF_admin_client_manager: [
            'add_dashboard',
            'read_dashboard',
            'update_dashboard',
            'add_organization',
            'read_organization',
            'update_organization',
            'create_subscription',
            'read_subscription',
            'update_subscription'
        ],
        VF_admin_administrator: [
            'add_dashboard',
            'read_dashboard',
            'update_dashboard',
            'add_library',
            'read_library',
            'update_library',
            'delete_library',
            'add_organization',
            'read_organization',
            'update_organization',
            'delete_organization',
            'create_subscription',
            'read_subscription',
            'update_subscription',
            'add_staff',
            'read_staff',
            'update_staff',
            'create_production',
            'read_production',
            'update_production',
            'delete_production',
            'add_tutorial',
            'read_tutorial',
            'update_tutorial',
            'delete_tutorial',
            'publish_tutorial',
            'add_module',
            'read_module',
            'update_module',
            'delete_module',
            'publish_module',
            'add_error_log',
            'read_error_log',
            'update_error_log',
            'delete_error_log'
        ]
    }
};
exports.default = defaultPermission;
//# sourceMappingURL=defaultPermission.js.map