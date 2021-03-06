import { browser as _protractorBrowser, ProtractorBrowser, browser } from 'protractor';
import { Element, ElementPromise } from './element';
import { ElementArray, ElementArrayPromise } from './element-array';
import { WaitFor, waiter } from './wait-for';

export class Browser {
    static allBrowsers: Browser[] = [];
    static getActive(): Browser {
        if (Browser.allBrowsers.length === 0) Browser.allBrowsers.push(new Browser())
        return Browser.allBrowsers[0];
    }

    isTerminated: boolean = false;

    constructor(
        public __protractorBrowser: ProtractorBrowser = _protractorBrowser,
    ) {

    }

    navigate(url: string): BrowserPromise {
        return new BrowserPromise((async () => {
            await browser.get(url);
            return this;
        })());
    }

    restart(): BrowserPromise {
        return new BrowserPromise((async () => {
            Browser.allBrowsers = Browser.allBrowsers.filter(x => x !== this);
            const result: Browser = new Browser(await this.__protractorBrowser.restart());
            this.isTerminated = true;
            Browser.allBrowsers.push(result);
            return result;
        })());
    }

    fork(useSameUrl?: boolean, copyMockModules?: boolean, copyConfigUpdates?: boolean): BrowserPromise {
        return new BrowserPromise((async () => {
            const result = new Browser(await this.__protractorBrowser.forkNewDriverInstance(useSameUrl, copyMockModules, copyConfigUpdates).ready);
            Browser.allBrowsers.push(result);
            return result;
        })());
    }

    element(cssSelector: string): ElementPromise {
        return new ElementPromise((async () => {
            return Element.ByCss(this, cssSelector);
        })());
    }

    all(cssSelector: string): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return ElementArray.ByCss(this, cssSelector);
        })());
    }

    async close(): Promise<void> {
        Browser.allBrowsers = Browser.allBrowsers.filter(x => x !== this);
        await this.__protractorBrowser.close();
    }

    async executeScript<T>(code: string): Promise<T> {
        const result: { success: boolean, value: T } = await <any>browser.executeAsyncScript(`
            const protractorCallback = arguments[arguments.length - 1];
            ((async () => {
                return await(() => {${code}})()
            })())
                .then(x => protractorCallback({success: true, value: x}))
                .catch(err => protractorCallback({success: false, value: err}));
        `);
        if (!result.success) throw result.value;
        return result.value;
    }

    async clearBrowserCache(): Promise<void> {
        await this.executeScript(`
            sessionStorage.clear();
            localStorage.clear();
        `);
    }

    async readLocalStorage(item: string): Promise<string> {
        return await browser.executeAsyncScript(`
            return localStorage.getItem('${item}');
        `) as string;
    }

    async writeLocalStorage(item: string, value: string): Promise<void> {
        return await browser.executeAsyncScript(`
            localStorage.setItem('${item}', '${value}');
        `);
    }

    async readSessionStorage(item: string): Promise<string> {
        return await browser.executeAsyncScript(`
            return sesionStorage.getItem('${item}');
        `) as string;
    }

    async writeSessionStorage(item: string, value: string): Promise<void> {
        return await browser.executeAsyncScript(`
            sesionStorage.setItem('${item}', '${value}');
        `);
    }

    wait(waitFor: WaitFor<Browser>, timeOut?: number): BrowserPromise {
        return new BrowserPromise((async () => {
            await waiter(this, waitFor, timeOut);
            return this;
        })());
    }

    expect(waitFor: WaitFor<Browser>): BrowserPromise {
        return new BrowserPromise((async () => {
            return this.wait(waitFor, 0);
        })());
    }

    sendKeys(...var_args: Array<string | Promise<string>>): BrowserPromise {
        return new BrowserPromise((async () => {
            await this.__protractorBrowser.actions().sendKeys(...var_args).perform();
            return this;
        })());
    }

}


export class BrowserPromise implements Promise<Browser>, Browser {
    constructor(
        public sourcePromise: Promise<Browser>
    ) {
    }

    get isTerminated(): boolean {
        throw new Error('property can not be accessed on Promise');
    }

    get __protractorBrowser(): ProtractorBrowser {
        throw new Error('property can not be accessed on Promise');
    }

    then<TResult1 = Browser, TResult2 = never>(onfulfilled?: (value: Browser) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
        return this.sourcePromise.then(onfulfilled, onrejected);
    }

    catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<Browser | TResult> {
        return this.sourcePromise.catch(onrejected);
    }

    [Symbol.toStringTag]: string;
    finally(onfinally?: () => void): BrowserPromise {
        return new BrowserPromise((async () => {
            return this.sourcePromise.finally(onfinally);
        })());
    }

    navigate(url: string): BrowserPromise {
        return new BrowserPromise((async () => {
            return (await this).navigate(url);
        })());
    }

    restart(): BrowserPromise {
        return new BrowserPromise((async () => {
            return (await this).restart();
        })());
    }

    fork(useSameUrl?: boolean, copyMockModules?: boolean, copyConfigUpdates?: boolean): BrowserPromise {
        return new BrowserPromise((async () => {
            return (await this).fork(useSameUrl, copyMockModules, copyConfigUpdates);
        })());
    }

    element(cssSelector: string): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).element(cssSelector);
        })());
    }

    expect(waitFor: WaitFor<Browser>): BrowserPromise {
        return new BrowserPromise((async () => {
            return (await this).expect(waitFor);
        })());
    }

    wait(waitFor: WaitFor<Browser>, timeOut?: number): BrowserPromise {
        return new BrowserPromise((async () => {
            return (await this).wait(waitFor, timeOut);
        })());
    }

    all(cssSelector: string): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return (await this).all(cssSelector);
        })());
    }

    async close(): Promise<void> {
        return (await this).close();
    }

    async executeScript<T>(code: string): Promise<T> {
        return (await this).executeScript(code);
    }

    async clearBrowserCache(): Promise<void> {
        return (await this).clearBrowserCache();
    }

    async readLocalStorage(item: string): Promise<string> {
        return (await this).readLocalStorage(item);
    }

    async writeLocalStorage(item: string, value: string): Promise<void> {
        return (await this).writeLocalStorage(item, value);
    }

    async readSessionStorage(item: string): Promise<string> {
        return (await this).readSessionStorage(item);
    }

    async writeSessionStorage(item: string, value: string): Promise<void> {
        return (await this).writeSessionStorage(item, value);
    }

    sendKeys(...var_args: Array<string | Promise<string>>): BrowserPromise {
        return new BrowserPromise((async () => {
            return (await this).sendKeys(...var_args);
        })());
    }

}
