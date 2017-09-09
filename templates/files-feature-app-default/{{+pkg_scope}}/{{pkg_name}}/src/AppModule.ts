// Modules
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";

import {RoutesModule} from "./RoutesModule";
import {AppComponent} from "./app/AppComponent";
import {HomeViewComponent} from "./home-view/HomeViewComponent";
// :: import {{{comp_class}}} from "./{{comp_selector}}/{{comp_file}}";

@NgModule({
    imports: [
        BrowserModule
        , CommonModule
        , RouterModule
        , ReactiveFormsModule
        , RoutesModule
    ],
    declarations: [
        AppComponent
        , HomeViewComponent
        // :: ,{{comp_class}}
    ],
    providers: [
        /* Put app-wide DI config here*/
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {}
