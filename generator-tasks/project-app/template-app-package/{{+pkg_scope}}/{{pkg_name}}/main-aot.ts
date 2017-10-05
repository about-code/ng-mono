import { platformBrowser }    from "@angular/platform-browser";
import { AppModuleNgFactory } from "./src/AppModule.ngfactory";
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
