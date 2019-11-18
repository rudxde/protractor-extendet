import { Element } from './element';
import { ExpectedConditions } from 'protractor';
import { Browser } from './browser';
import { ElementArray } from './element-array';
import { DEFAULT_WAIT_TIME } from './config';

export type WaitFor<T> = (element: T) => Promise<any>;
export type WaitForFactory<T> = ((...args: any[]) => WaitFor<T>);
interface PreconditionMap<T extends WaitFor<any>> extends Map<T | ((...args: any[]) => T), T[]> {
    set<K extends T>(key: (K | ((...args: any[]) => K)), value: K[]): this;
    get<K extends T>(key: (K | ((...args: any[]) => K))): K[] | undefined;
}

async function executePreconditions<T>(waitFor: WaitFor<T> | WaitForFactory<T>, element: T): Promise<void> {
    const waitsPres: WaitFor<T>[] = preconditions.get(waitFor) || [];
    for (let precondition of waitsPres) {
        await precondition(element);
    }
}

const preconditions: PreconditionMap<WaitFor<any>> = new Map();

export function setPreconditionForWait<T>(forWait: WaitFor<T> | WaitForFactory<T>, set: WaitFor<T>): void {
    const existingpreconditions = preconditions.get(forWait) || [];
    preconditions.set(forWait, [...existingpreconditions, set]);
}

export function waiter<T>(element: T, waitFor: WaitFor<T>, timeOut: number = DEFAULT_WAIT_TIME): Promise<void> {
    return new Promise((resolve, reject) => {
        const timeOutTimer = setTimeout(() => {
            reject(new Error(`wait Timed out after ${timeOut} ms.`));
        }, timeOut);
        waitFor(element).then(() => {
            clearTimeout(timeOutTimer);
            resolve();
        })
    });
}

export const Clickable = async (element: Element | ElementArray) => {
    await executePreconditions(Clickable, element);
    if (element instanceof Element) {
        await element.browser.__protractorBrowser.wait(ExpectedConditions.elementToBeClickable(element.__protractorElementFinder));
    } else {
        await element.map(e => e.wait(Clickable));
    }
}

export const Selected = async (element: Element) => {
    await executePreconditions(Selected, element);
    await element.browser.__protractorBrowser.wait(ExpectedConditions.elementToBeClickable(element.__protractorElementFinder));
}

export const Present = async (element: Element | ElementArray) => {
    await executePreconditions(Present, element);
    if (element instanceof Element) {
        await element.browser.__protractorBrowser.wait(ExpectedConditions.presenceOf(element.__protractorElementFinder));
    } else {
        await element.map(e => e.wait(Present));
    }
}

export const Staleness = async (element: Element | ElementArray) => {
    await executePreconditions(Staleness, element);
    if (element instanceof Element) {
        await element.browser.__protractorBrowser.wait(ExpectedConditions.stalenessOf(element.__protractorElementFinder));
    } else {
        await element.map(e => e.wait(Staleness));
    }
}

export const Visible = async (element: Element | ElementArray) => {
    await executePreconditions(Visible, element);
    if (element instanceof Element) {
        await element.browser.__protractorBrowser.wait(ExpectedConditions.visibilityOf(element.__protractorElementFinder));
    } else {
        await element.map(e => e.wait(Visible));
    }
}

export const Invisible = async (element: Element | ElementArray) => {
    await executePreconditions(Invisible, element);
    if (element instanceof Element) {
        await element.browser.__protractorBrowser.wait(ExpectedConditions.invisibilityOf(element.__protractorElementFinder));
    } else {
        await element.map(e => e.wait(Invisible));
    }
}

export function TitleContain(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(TitleContain, element);
        await element.__protractorBrowser.wait(ExpectedConditions.titleContains(text));
    }
}

export function TitleIs(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(TitleIs, element);
        await element.__protractorBrowser.wait(ExpectedConditions.titleIs(text));
    }
}

export function UrlContain(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(UrlContain, element);
        await element.__protractorBrowser.wait(ExpectedConditions.urlContains(text));
    }
}

export function UrlIs(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(UrlIs, element);
        await element.__protractorBrowser.wait(ExpectedConditions.urlIs(text));
    }
}

export function TextToBePresent(text: string): WaitFor<Element> {
    return async (element: Element) => {
        await executePreconditions<Element>(TextToBePresent, element);
        await element.browser.__protractorBrowser.wait(ExpectedConditions.textToBePresentInElement(element.__protractorElementFinder, text));
    }
}

export function TextToBePresentInValue(text: string): WaitFor<Element> {
    return async (element: Element) => {
        await executePreconditions<Element>(TextToBePresentInValue, element);
        await element.browser.__protractorBrowser.wait(ExpectedConditions.textToBePresentInElementValue(element.__protractorElementFinder, text));
    }
}

export function And<T>(a: WaitFor<T>, b: WaitFor<T>): WaitFor<T> {
    return async (element: T) => {
        await Promise.all([a(element), b(element)]);
    }
}
export function Or<T>(a: WaitFor<T>, b: WaitFor<T>): WaitFor<T> {
    return async (element: T) => {
        return new Promise(resolve => {
            a(element).then(resolve);
            b(element).then(resolve);
        });
    }
}

export const DocumentReady: WaitFor<Browser> = async (element: Browser) => {
    await element.executeScript(`
        if (document.readyState !== 'loading') {
            return;
        }
        return new Promise(resolve => {
            document.addEventListener("DOMContentLoaded", (event) => {
                document.removeEventListener('DOMContentLoaded');
                resolve();
            });
        });
    `);
}

export const BrowserIsReady: WaitFor<Browser> = async (element: Browser) => {
    await element.__protractorBrowser.ready;
}



setPreconditionForWait(Clickable, Visible);
setPreconditionForWait(Visible, Present);
setPreconditionForWait(Staleness, Invisible);
setPreconditionForWait(Selected, Visible);

setPreconditionForWait<Browser>(UrlIs, DocumentReady);
setPreconditionForWait<Browser>(UrlContain, DocumentReady);
setPreconditionForWait<Browser>(TitleIs, DocumentReady);
setPreconditionForWait<Browser>(TitleContain, DocumentReady);
