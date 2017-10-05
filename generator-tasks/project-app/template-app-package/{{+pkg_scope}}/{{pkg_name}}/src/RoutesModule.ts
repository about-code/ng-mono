import {ModuleWithProviders} from "@angular/core";
import {Route, Routes, RouterModule} from "@angular/router";

import {HomeViewComponent} from "./home-view/HomeViewComponent";
// :: import {{{comp_class}}} from "./{{comp_selector}}/{{comp_file}}";

export const ROUTES: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" }
    , { path: "home", component: HomeViewComponent }
    // :: ,{path: "{{comp_route}}", component: {{comp_class}} }
];
export const RoutesModule: ModuleWithProviders = RouterModule.forRoot(ROUTES);
