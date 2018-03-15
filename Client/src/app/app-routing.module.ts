import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ApplicantComponent } from './applicant/applicant.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { JobListComponent } from './job-list/job-list.component';
import { ApplicantSearchComponent } from './applicant-search/applicant-search.component';
import { AddApplicantComponent } from './add-applicant/add-applicant.component';
import { AddUserComponent } from './add-user/add-user.component';

const routes : Routes = 
[
  {path : 'login', component : LoginComponent},
  {path : 'home', component : HomeComponent},
  {path : 'applicant', component : ApplicantComponent},
  {path : 'job', component : JobListComponent},
  {path : 'job/editJob/:jobID', component : EditJobComponent},
  {path : 'applicantS', component : ApplicantSearchComponent},

  {path : 'addApplicant', component : AddApplicantComponent},
  {path : 'register', component : AddUserComponent},

  {path : '', component : WelcomeComponent},
  {path : '**', component : NotFoundComponent}
];

@NgModule({
  exports: [
    RouterModule
  ],
   imports: [ 
    RouterModule.forRoot(routes) 
  ]
})
export class AppRoutingModule { }
