import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { AclAdminUserListing } from './aclAdminUser/components/aclAdminUserListing/aclAdminUserListing';
import { AclTerminalListing } from './aclTerminal/components/aclTerminalListing/aclTerminalListing';
import { OpServiceListing } from './operational/components/opServiceListing/opServiceListing';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'aclAdminUser', component: AclAdminUserListing },
    { path: 'aclTerminal', component: AclTerminalListing },
    { path: 'operational/opService', component: OpServiceListing },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
