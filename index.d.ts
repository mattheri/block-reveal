interface RevealOptionsSettings {
    [key: string]: any;
    direction?: "lr" | "rl" | "tb" | "bt";
    bgColor?: string;
    duration?: number;
    easing?: "linear" | "easeInQuad" | "easeInSine" | "easeOutSine" | "easeInOutSine" | "easeInOutQuint" | "easeInCubic" | "easeInOutCubic" | "easeInQuint" | "easeOutQuint" | "easeInOutQuint" | "easeInCirc" | "easeOutCirc" | "easeInOutCirc" | "easeInQuad" | "easeOutQuad" | "easeInOutQuad" | "easeInQuart" | "easeOutQuart" | "easeInOutQuart" | "easeInExpo" | "easeOutExpo" | "easeInOutExpo";
    area?: number;
    delay?: number;
    onCover?: (contentElement?: HTMLElement, revealElement?: HTMLElement) => boolean;
    onStart?: (contentElement?: HTMLElement, revealElement?: HTMLElement) => boolean;
    onComplete?: (contentElement?: HTMLElement, revealElement?: HTMLElement) => boolean;
}
interface RevealOptions {
    [key: string]: any;
    hidden?: boolean;
    settings?: RevealOptionsSettings;
}
interface TransformSettings {
    [key: string]: any;
    val: string;
    origin: {
        initial: string;
        halfway: string;
    };
}
interface Reveal {
    element: HTMLElement;
    options: RevealOptions | undefined;
    transformSettings: TransformSettings;
    contentElement: HTMLElement;
    revealElement: HTMLElement;
    init: void;
    animating: boolean;
}
declare class Reveal implements Reveal {
    constructor(element: HTMLElement, options?: RevealOptions);
    _layout(): void;
    _createElement(tag: string, className?: string, content?: string): HTMLElement;
    _getTransformSettings(direction?: string): void;
    reveal(): false | undefined;
    _init(): void;
}
export default Reveal;
