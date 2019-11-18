import { protractor } from 'protractor/built/ptor';
import { IKey as seleniumKey } from 'selenium-webdriver';

export type IKey = seleniumKey;
export const Key = protractor.Key;