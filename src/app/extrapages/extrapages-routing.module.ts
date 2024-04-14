import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from './page404/page404.component';
import { Login2Component } from '../account/auth/login2/login2.component';

const routes: Routes = [
    {
        path: '404',
        component: Page404Component
    },
    {
        path: 'login-2',
        component: Login2Component
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ExtrapagesRoutingModule { }
