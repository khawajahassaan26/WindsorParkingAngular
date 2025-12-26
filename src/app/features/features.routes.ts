import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { AclAdminUserListing } from './aclAdminUser/components/aclAdminUserListing/aclAdminUserListing';
import { AclTerminalListing } from './aclTerminal/components/aclTerminalListing/aclTerminalListing';
import { OpServiceListing } from './operational/components/opServiceListing/opServiceListing';
import { OpSiteListing } from './operational/components/opSiteListing/opSiteListing';
import { OpVehicleTypeListing } from './operational/components/opVehicleTypeListing/opVehicleTypeListing';
import { OpTerminalRegistrationRequestListing } from './operational/components/opTerminalRegistrationRequestListing/opTerminalRegistrationRequestListing';

export default [
    { path: 'empty', component: Empty },
    { path: 'aclAdminUser', component: AclAdminUserListing },
    { path: 'aclTerminal', component: AclTerminalListing },
    { path: 'operational/opService', component: OpServiceListing },
    { path: 'operational/opSite', component: OpSiteListing },
    { path: 'operational/opVehicleType', component: OpVehicleTypeListing },
    { path: 'operational/opTerminalRegistrationRequest', component: OpTerminalRegistrationRequestListing },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
