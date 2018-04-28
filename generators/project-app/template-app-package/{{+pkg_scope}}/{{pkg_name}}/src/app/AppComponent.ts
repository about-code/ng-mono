import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "ng-app",
    templateUrl: "./AppComponent.html"
})
export class AppComponent implements OnInit {

    private _router: Router | null = null;

    constructor(router: Router) {
        this._router = router;
    }

    ngOnInit() {
    }
}
