export interface Countable<T extends Promise<any>> {
    count(): Promise<number>;
    first(): T;
    second(): T;
    third(): T;
    last(): T;
}
