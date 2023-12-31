import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';

const routes: Routes = [
    { path: 'signup', component: SignUpComponent },
    { path: 'login', component: LoginComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class AuthRoutingModule {}
