import { Element } from './element';
import { ExpectedConditions } from 'protractor';
import { Browser } from './browser';
import { ElementArray } from './element-array';

export type WaitFor<T> = (element: T) => Promise<void>;

export const Clickable = async (element: Element | ElementArray) => {
    await element.wait(Visible);
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.elementToBeClickable(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Clickable));
    }
}

export const Selected = async (element: Element) => {
    await element.browser.protractorBrowser.wait(ExpectedConditions.elementToBeClickable(element.protractorElementFinder));
}

export const Present = async (element: Element | ElementArray) => {
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.presenceOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Present));
    }
}

export const Staleness = async (element: Element | ElementArray) => {
    await element.wait(Invisible);
    if (element instanceof Element) {
        await element.browser.protractorBrowser.wait(ExpectedConditions.stalenessOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Staleness));
    }
}

export const Visible = async (element: Element | ElementArray) => {
    await element.wait(Present);
    if(element instanceof Element) {
    await element.browser.protractorBrowser.wait(ExpectedConditions.visibilityOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Visible));
    }
}

export const Invisible = async (element: Element | ElementArray) => {
    if(element instanceof Element) {
    await element.browser.protractorBrowser.wait(ExpectedConditions.invisibilityOf(element.protractorElementFinder));
    } else {
        await element.map(e => e.wait(Invisible));
    }
}

export function TitleContain(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await element.protractorBrowser.wait(ExpectedConditions.titleContains(text));
    }
}

export function TitleIs(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await element.protractorBrowser.wait(ExpectedConditions.titleIs(text));
    }
}

export function UrlContain(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await element.protractorBrowser.wait(ExpectedConditions.urlContains(text));
    }
}

export function UrlIs(text: string): WaitFor<Browser> {
    return async (element: Browser) => {
        await element.protractorBrowser.wait(ExpectedConditions.urlIs(text));
    }
}

export function TextToBePresent(text: string): WaitFor<Element> {
    return async (element: Element) => {
        await element.browser.protractorBrowser.wait(ExpectedConditions.textToBePresentInElement(element.protractorElementFinder, text));
    }
}

export function TextToBePresentInValue(text: string): WaitFor<Element> {
    return async (element: Element) => {
        await element.browser.protractorBrowser.wait(ExpectedConditions.textToBePresentInElementValue(element.protractorElementFinder, text));
    }
}

