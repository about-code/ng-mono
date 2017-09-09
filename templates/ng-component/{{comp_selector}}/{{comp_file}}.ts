import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: "<%= comp_selector %>",
    templateUrl: "./<%= comp_file %>.html"
})
export class <%= comp_class %> implements OnInit, OnDestroy {

    private _route: ActivatedRoute = null;

    constructor(route: ActivatedRoute) {
        this._route = route;
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
