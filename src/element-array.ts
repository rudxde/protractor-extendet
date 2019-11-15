import { Element, ElementPromise } from "./element";
import { ElementArrayFinder, ElementFinder } from "protractor";
import { Browser } from "./browser";
import { Countable } from "./countable";
import { WaitFor } from "./wait-for";

export class ElementArray implements Countable<ElementPromise> {
    static async ByCss(browser: Browser, cssSelector: string, parent?: Element): Promise<ElementArray> {
        const protractorElementArrayFinder = parent ?
            parent.protractorElementFinder.$$(cssSelector) :
            browser.protractorBrowser.$$(cssSelector);
        const elementFinderArray: ElementFinder[] = [];
        for (let i = 0; i < await protractorElementArrayFinder.count(); i++) {
            elementFinderArray.push(protractorElementArrayFinder.get(i));
        }
        if (parent) {
            return new ElementArray(browser, elementFinderArray, parent);
        } else {
            return new ElementArray(browser, elementFinderArray);
        }
    }
    elements: Element[] = [];

    constructor(
        public browser: Browser,
        public protractorElementFinderArray: ElementFinder[],
        public parent?: Element,
    ) {
        for (let elementFinder of protractorElementFinderArray) {
            this.elements.push(new Element(this.browser, elementFinder, parent))
        }
    }

    get(index: number): ElementPromise {
        return new ElementPromise((async () => {
            return this.elements[index];
        })());
    }

    async count(): Promise<number> {
        return await this.elements.length;
    }

    first(): ElementPromise {
        return this.get(0);
    }
    second(): ElementPromise {
        return this.get(1);
    }
    third(): ElementPromise {
        return this.get(2);
    }

    last(): ElementPromise {
        return new ElementPromise((async () => {
            const lastIndex = await this.count() - 1;
            return this.get(lastIndex);
        })());
    }

    filter(filterFn: (element: Element) => Promise<boolean>): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            const allPromises: (Promise<Element | undefined>)[] = [];
            for (let element of this.elements) {
                allPromises.push(
                    filterFn(element).then(x => x ? element : undefined)
                );
            }
            const filteredElements = await Promise.all(allPromises).then(x => x.filter(Boolean)) as Element[];
            return new ElementArray(this.browser, filteredElements.map(x => x.protractorElementFinder), this.parent);
        })());
    }

    find(filterFn: (element: Element) => Promise<boolean>): ElementPromise {
        return new ElementPromise((async () => {
            const allPromises: (Promise<Element | undefined>)[] = [];
            for (let element of this.elements) {
                allPromises.push(
                    filterFn(element).then(x => x ? element : undefined)
                );
            }
            const filteredElements: Element[] =
                await Promise.all(allPromises).then(x => x.filter(Boolean)) as Element[];
            if (filteredElements.length === 0) throw new Error();
            return filteredElements[0];
        })());
    }

    forEach(fn: (element: Element) => Promise<any>): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            for (let element of this.elements) {
                await fn(element);
            }
            return this;
        })());
    }

    async map<T>(fn: (element: Element) => Promise<T>): Promise<T[]> {
        const allPromises: (Promise<T>)[] = [];
        for (let element of this.elements) {
            allPromises.push(fn(element));
        }
        return Promise.all(allPromises);
    }

    wait(waitFor: WaitFor<ElementArray>): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            await waitFor(this);
            return this;
        })());
    }

}


export class ElementArrayPromise implements Promise<ElementArray>, ElementArray {
    parent?: Element = undefined;
    get elements(): Element[] {
        throw new Error('property can not be accessed on Promise');
    }
    get browser(): Browser {
        throw new Error('property can not be accessed on Promise');
    }
    get protractorElementFinderArray(): ElementFinder[] {
        throw new Error('property can not be accessed on Promise');
    }
    constructor(
        public sourcePromise: Promise<ElementArray>
    ) {
    }

    get(index: number): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).get(index);
        })());
    }

    first(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).first();
        })());
    }

    second(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).second();
        })());
    }

    third(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).third();
        })());
    }

    last(): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).last();
        })());
    }

    count(): Promise<number> {
        return this.then(x => x.count());
    }

    filter(filterFn: (element: Element) => Promise<boolean>): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return (await this).filter(filterFn);
        })());
    }

    find(filterFn: (element: Element) => Promise<boolean>): ElementPromise {
        return new ElementPromise((async () => {
            return (await this).find(filterFn);
        })());
    }

    forEach(fn: (element: Element) => Promise<any>): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return (await this).forEach(fn);
        })());
    }

    map<T>(fn: (element: Element) => Promise<T>): Promise<T[]> {
        return this.then(x => x.map(fn));
    }

    wait(waitFor: WaitFor<ElementArray>): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return (await this).wait(waitFor);
        })());
    }

    then<TResult1 = Browser, TResult2 = never>(onfulfilled?: (value: ElementArray) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
        return this.sourcePromise.then(onfulfilled, onrejected);
    }

    catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<ElementArray | TResult> {
        return this.sourcePromise.catch(onrejected);
    }

    [Symbol.toStringTag]: string;

    finally(onfinally?: () => void): ElementArrayPromise {
        return new ElementArrayPromise((async () => {
            return this.sourcePromise.finally(onfinally);
        })());
    }

}