import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AppComponent } from "./AppComponent";

@Component({selector: "router-outlet", template: ""})
class RouterOutletStubComponent { }

/**
 * .spec.-Files will be found anywhere inside the packages folder. If you want
 * to have test specs in a separate folder feel free to move them elsewhere.
 * The test below is a sample of a test for a component with a <router-outlet>
 * like our sample AppComponent. See angular.io to learn more about Angular
 * testing.
 */
describe("AppComponent", () => {

    beforeEach(() => {
        const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"]);
        TestBed.configureTestingModule({
            declarations: [AppComponent, RouterOutletStubComponent],
            providers: [
                { provide: Router, useValue: routerSpy}
            ]
        });
    });

    it("should succeed", () => {
        const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
        expect(fixture).toBeDefined("No fixture created");
    });
});
