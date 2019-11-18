import { Browser } from "./browser";
import { ElementFinder, by } from "protractor";
import { ElementArray, ElementArrayPromise } from "./element-array";
import { WaitFor, waiter } from "./wait-for";
import { Key } from "./keys";

export class Element {
    static ByCss(browser: Browser, cssSelector: string, parent?: Element): Element {
        if (parent) {
            return new Element(browser, parent.__protractorElementFinder.$(cssSelector), parent);
        } else {
            return new Element(browser, browser.__protractorBrowser.$(cssSelector));
        }
    }

    constructor(
        public browser: Browser,
        public __protractorElementFinder: ElementFinder,
        public parent?: Element,
    ) {

    }

    element(cssSelector: string): ElementPromise {
        return new ElementPromise((async () => {
            return Element.ByCss(this.browser, cssSelector, this);
        })());
    }

    all(cssSelector: string): ElementArray {
        return new ElementArrayPromise(ElementArray.ByCss(this.browser, cssSelector, this))
    }

    click(): ElementPromise {
        return new ElementPromise((async () => {
            await this.__protractorElementFinder.click();
            return this;
        })());
    }

    wait(waitFor: WaitFor<Element>, timeOut?: number): ElementPromise {
        return new ElementPromise((async () => {
            await waiter(this, waitFor, timeOut);
            return this;
        })());
    }

    async text(): Promise<string> {
        return await this.__protractorElementFinder.getText()
    }

    async attribute(name: string): Promise<string> {
        return await this.__protractorElementFinder.getAttribute(name);
    }

    async value(): Promise<string> {
        return await this.__protractorElementFinder.getAttribute('value');
    }

    async cssClasss(): Promise<string[]> {
        return await this.__protractorElementFinder.getAttribute('class').then(x => x.split(' '));
    }

    directParent(): ElementPromise {
        return new ElementPromise((async () => {
            return new Element(this.browser, this.__protractorElementFinder.element(by.xpath('..')));
        })());
    }

    sendKeys(...var_args: Array<string | number | Promise<string | number>>): ElementPromise {
        return new ElementPromise((async () => {
            await this.__protractorElementFinder.sendKeys(...var_args);
            return this;
        })());
    }

    clearValue(): ElementPromise {
        return new ElementPromise((async () => {
            await this.__protractorElementFinder.clear();
            return this;
        })());
    }

    clearText(): ElementPromise {
        return new ElementPromise((async () => {
            const value: string = await this.value();
            for (let i = 0; i < value.length; i++) {
                await this.sendKeys(Key.BACK_SPACE);
            }
            return this;
        })());
    }

    expect(waitFor: WaitFor<Element>): ElementPromise {
        return new ElementPromise((async () => {
            return this.wait(waitFor, 0);
        })());
    }

}

export class ElementPromise implements Promise<Element>, Element {
    get browser(): Browser {
        throw new Error('property can not be accessed on Promise');
    }
    get __protractorElementFinder(): ElementFinder {
        throw new Error('property can not be accessed on Promise');
    }
    constructor(
        public sourcePromise: Promise<Element>
    ) {
    }

    element(cssSelector: string): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).element(cssSelector);
        })());
    }
    all(cssSelector: string): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return (await this).all(cssSelector);
        })());
    }
    click(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).click();
        })());
    }

    wait(waitFor: WaitFor<Element>, timeOut?: number): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).wait(waitFor, timeOut);
        })());
    }

    expect(waitFor: WaitFor<Element>): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).expect(waitFor);
        })());
    }

    async text(): Promise<string> {
        return (await this).text();
    }

    async attribute(name: string): Promise<string> {
        return (await this).attribute(name);
    }

    async value(): Promise<string> {
        return (await this).value();
    }

    async cssClasss(): Promise<string[]> {
        return (await this).cssClasss();
    }

    sendKeys(...var_args: Array<string | number | Promise<string | number>>): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).sendKeys(...var_args);
        })());
    }

    clearValue(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).clearValue();
        })());
    }

    clearText(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).clearText();
        })());
    }

    directParent(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).directParent();
        })());
    }

    then<TResult1 = Browser, TResult2 = never>(onfulfilled?: (value: Element) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
        return this.sourcePromise.then(onfulfilled, onrejected);
    }

    catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<Element | TResult> {
        return this.sourcePromise.catch(onrejected);
    }

    [Symbol.toStringTag]: string;

    finally(onfinally?: () => void): ElementPromise {
        return new ElementPromise((async () => {
            return this.sourcePromise.finally(onfinally);
        })());
    }
}
