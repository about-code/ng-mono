import { browser, by } from "protractor";

describe("AppComponent", () => {

    it("should display 'Welcome Home'", (done: any) => {
        browser.get("http://localhost:8080<%= app_ctx_root %>");
        browser
            .findElement(by.xpath(".//h1"))
            .then(el => el.getText())
            .then(innerText => {
                expect(innerText).toBe("Welcome Home", "Wrong inner text. Did HomeViewComponent-Template change?");
                done();
            })
            .catch((err: any) => {
                fail(err);
                done();
            });
    });
});
