import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
    selector: "home-view",
    template: "<h1>Welcome Home</h1>"
})
export class HomeViewComponent implements OnInit {

    private _route: ActivatedRoute | null  = null;

    constructor(route: ActivatedRoute) {
        this._route = route;
    }

    ngOnInit() {
    }
}
