import { Browser } from "./browser";
import { Clickable, Visible, BrowserIsReady, UrlContain, TitleContain, Invisible, Or, UrlIs } from "./wait-for";
import { Key } from "./keys";
function it(description: string, funciton: (b: Browser) => Promise<any>) { }

class StartPage {
    constructor(private browser: Browser) { }
    getSearchBar = () => this.browser.element('.seatch');
    getSearchButton = () => this.browser.element('button[type=submit]');
}

async () => {
    it('should navigate to google.de',
        async browser => {
            await browser
                .restart()
                .wait(BrowserIsReady)
                .navigate('google.de')
                .expect(TitleContain('Google'))
                .element('ibput.search')
                .sendKeys('Meine Suche', Key.ENTER);
            await browser.wait(Or(UrlContain('/search?q='), UrlContain('/404')));
            
        }
    );

    it('should click searchbar',
        b => new StartPage(b)
            .getSearchBar()
            .all('li')
            .forEach(e => e.wait(Clickable).click())
    )

}

