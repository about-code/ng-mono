// Modules
import {NgModule, ModuleWithProviders} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {RoutesModule} from "./RoutesModule";
// :: import {{{comp_class}}} from "./{{comp_selector}}/{{comp_class}}";

@NgModule({
    imports: [
        BrowserModule
        , CommonModule
        , RouterModule
        , RoutesModule
    ],
    declarations: [
        // :: [, ]{{comp_class}}
    ],
    providers: []
})
export class <%= exported_name %> {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: <%= exported_name %>,
            providers: []
        };
    }
}
