import { Routes } from '@angular/router';
import { PortfolioComponent } from './S19/portfolio/portfolio.component';
import { NgModule } from '@angular/core';


export const routes: Routes = [
    { path: '', component: PortfolioComponent },
    { path: 'portfolio', component: PortfolioComponent },
];