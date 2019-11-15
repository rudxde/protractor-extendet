import { Element } from './element';
import { ExpectedConditions } from 'protractor';
import { Browser } from './browser';
import { ElementArray } from './element-array';
import { DEFAULT_WAIT_TIME } from './config';

export type WaitFor<T> = (element: T) => Promise<void>;

interface PreconditionMap<T extends WaitFor<any>> extends Map<T | ((...args: any[]) => T), T[]> {
    set<K extends T>(key: (K | ((...args: any[]) => K)), value: K[]): this;
    get<K extends T>(key: (K | ((...args: any[]) => K))): K[] | undefined;
}

async function executePreconditions<T>(waitFor: WaitFor<T> | ((...args: any[]) => WaitFor<T>), element: T): Promise<void> {
    const waitsPres: WaitFor<T>[] = preconditions.get(waitFor) || [];
    for (let precondition of waitsPres) {
        await precondition(element);
    }
}

const preconditions: PreconditionMap<WaitFor<any>> = new Map();

export function setPreconditionForWait<T>(forWait: WaitFor<T>, set: WaitFor<T>): void {
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
        await element.browser.protractorBrowser.wait(ExpectedConditions.elementToBeClickable(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Clickable));
    }
}

export const Selected = async (element: Element) => {
    await executePreconditions(Selected, element);
    await element.browser.protractorBrowser.wait(ExpectedConditions.elementToBeClickable(element.protractorElementFinder));
}

export const Present = async (element: Element | ElementArray) => {
    await executePreconditions(Present, element);
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.presenceOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Present));
    }
}

export const Staleness = async (element: Element | ElementArray) => {
    await executePreconditions(Staleness, element);
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.stalenessOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Staleness));
    }
}

export const Visible = async (element: Element | ElementArray) => {
    await executePreconditions(Visible, element);
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.visibilityOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Visible));
    }
}

export const Invisible = async (element: Element | ElementArray) => {
    await executePreconditions(Invisible, element);
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.invisibilityOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Invisible));
    }
}

export function TitleContain(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(TitleContain, element);
        await element.protractorBrowser.wait(ExpectedConditions.titleContains(text));
    }
}

export function TitleIs(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(TitleIs, element);
        await element.protractorBrowser.wait(ExpectedConditions.titleIs(text));
    }
}

export function UrlContain(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(UrlContain, element);
        await element.protractorBrowser.wait(ExpectedConditions.urlContains(text));
    }
}

export function UrlIs(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await executePreconditions<Browser>(UrlIs, element);
        await element.protractorBrowser.wait(ExpectedConditions.urlIs(text));
    }
}

export function TextToBePresent(text: string): WaitFor<Element> {
    return async (element: Element) => {
        await executePreconditions<Element>(TextToBePresent, element);
        await element.browser.protractorBrowser.wait(ExpectedConditions.textToBePresentInElement(element.protractorElementFinder, text));
    }
}

export function TextToBePresentInValue(text: string): WaitFor<Element> {
    return async (element: Element) => {
        await executePreconditions<Element>(TextToBePresentInValue, element);
        await element.browser.protractorBrowser.wait(ExpectedConditions.textToBePresentInElementValue(element.protractorElementFinder, text));
    }
}


setPreconditionForWait(Clickable, Visible);
setPreconditionForWait(Visible, Present);
setPreconditionForWait(Staleness, Invisible);
setPreconditionForWait(Selected, Visible);
