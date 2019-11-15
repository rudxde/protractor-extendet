import { Browser } from "./browser";
import { Clickable } from "./wait-for";
function it(description: string, funciton: (b: Browser) => Promise<any>) { }

class StartPage {
    constructor(private browser: Browser) { }
    getSearchBar = () => this.browser.element('.seatch');
    getSearchButton = () => this.browser.element('button[type=submit]');
}

async () => {
    it('should navigate to google.de',
        b => b
            .restart()
            .navigate('google.de')
    );

    it('should click searchbar',
        b => new StartPage(b)
            .getSearchBar()
            .click()
            .all('li')
            .forEach(e => e.wait(Clickable).click())
    )

}

