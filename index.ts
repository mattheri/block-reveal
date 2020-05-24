import anime from "animejs";

interface RevealOptionsSettings {
    [key: string]: any;
    direction?: "lr" | "rl" | "tb" | "bt";
    bgColor?: string;
    duration?: number;
    easing?: "linear" | "easeInQuad" | "easeInSine" | "easeOutSine" | "easeInOutSine"
    | "easeInOutQuint" | "easeInCubic" | "easeInOutCubic" | "easeInQuint" | "easeOutQuint"
    | "easeInOutQuint" | "easeInCirc" | "easeOutCirc" | "easeInOutCirc" | "easeInQuad"
    | "easeOutQuad" | "easeInOutQuad" | "easeInQuart" | "easeOutQuart" | "easeInOutQuart"
    | "easeInExpo" | "easeOutExpo" | "easeInOutExpo";
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
    options:  RevealOptions | undefined;
    transformSettings: TransformSettings;
    contentElement: HTMLElement;
    revealElement: HTMLElement;
    init: void;
    animating: boolean;
}

class Reveal implements Reveal {
    constructor(
        element: HTMLElement,
        options?: RevealOptions,
    ) {
        this.element = element;
        this.options = options;
        this.transformSettings;
        this.contentElement;
        this.revealElement;
        this.animating;
        this.init = this._init();
    }

    _layout() {
        const position: string = getComputedStyle(this.element).position;
        if (position !== "fixed" && position !== "absolute" && position !== "relative") {
            this.element.style.position = "relative";
        };

        const contentElement: HTMLElement =
            this._createElement(
                "div",
                "block_content",
                this.element.innerHTML
            );
        
        const revealElement: HTMLElement =
            this._createElement(
                "div",
                "block_revealer"
            );
        
        this.contentElement = contentElement;
        if (this.options?.hidden) this.contentElement.style.opacity = "0";
        this.revealElement = revealElement;
        this.element.innerHTML = "";
        this.element.appendChild(contentElement);
        this.element.appendChild(revealElement);
    }

    _createElement(tag: string, className?: string, content?: string) {
        const element: HTMLElement = document.createElement(tag);
        element.className = className || "";
        element.innerHTML = content || "";

        return element;
    }

    _getTransformSettings(direction?: string) {

        interface Settings {
            val: string;
            origin: string;
            origin2: string;
        }

        const settings: {[key: string]: Settings} = {
            lr: {
                val: "scale3d(1,1,1)",
                origin: "0% 50%",
                origin2: "100% 50%"
            },
            rl: {
                val: "scale3d(1,1,1)",
				origin: "100% 50%",
				origin2: "0% 50%"
            },
            tb: {
                val: "scale3d(1,1,1)",
                origin: "50% 0%",
                origin2: "50% 100%"
            },
            bt: {
                val: "scale3d(1,1,1)",
                origin: "50% 100%",
                origin2: "50% 0%"
            },
            default: {
                val: "scale3d(1,1,1)",
                origin: "0% 50%",
                origin2: "100% 50%"
            }

        }

        if (direction) {
            this.transformSettings = {
                val: settings[direction].val,
                origin: {
                    initial: settings[direction].origin,
                    halfway: settings[direction].origin2
                }
            }
        } else {
            this.transformSettings = {
                val: settings.default.val,
                origin: {
                    initial: settings.default.origin,
                    halfway: settings.default.origin2
                }
            }
        };
    }

    reveal() {

        if (this.animating) {
            return false;
        }

        this.animating = true;

        const defaults: RevealOptions = {
            hidden: true,
            settings: {
                area: 0,
                bgColor: "#000000",
                direction: "lr",
                duration: 500,
                easing: "easeInOutExpo",
                delay: 0,
                onCover: function (contentElement, revealElement) { return false },
                onStart: function (contentElement, revealElement) { return false },
                onComplete: function (contentElement, revealElement) { return false }
            }
        };

        const settings = defaults;

        for (let i in settings) {
            if (this.options) {
                if (i === "hidden") {
                    settings[i] = this.options[i] !== undefined ? this.options[i] : settings[i];
                }
            };
        };

        for (let i in settings.settings) {
            if (this.options?.settings) {
                settings.settings[i] = this.options.settings[i] !== undefined ? this.options.settings[i] : settings.settings[i];
            };
        };

        if (settings.settings?.bgColor) this.revealElement.style.background = settings.settings.bgColor;
        this.revealElement.style.opacity = "1";
        this.revealElement.style.position = "absolute";
        this.revealElement.style.left = "0";
        this.revealElement.style.top = "0";
        this.revealElement.style.width = "100%";
        this.revealElement.style.height = "100%";
        this.revealElement.style.zIndex = "1000";
        this.revealElement.style.webkitTransform = this.revealElement.style.transform = this.transformSettings.val;
        this.revealElement.style.webkitTransformOrigin = this.revealElement.style.transformOrigin = this.transformSettings.origin.initial;
        const self = this;

        interface AnimationSettings extends RevealOptionsSettings {
            targets: HTMLElement;
            complete: () => void;
            update?: (a: any) => void;
            scaleX?: [number, number];
            scaleY?: [number, number];
        };


        const animationStepTwo: AnimationSettings = {
            targets: this.revealElement,
            duration: settings.settings?.duration,
            easing: settings.settings?.easing,
            update: function (animation) {
                if (animation.progress > 1) {
                    self.contentElement.style.opacity = "1";
                }
            },
            complete: function () {
                self.animating = false;
                if (typeof settings.settings?.onComplete === "function") {
                    settings.settings.onComplete(self.contentElement, self.revealElement);
                };
            }
        };

        const animationStepOne: AnimationSettings = {
            targets: this.revealElement,
            duration: settings.settings?.duration,
            easing: settings.settings?.easing,
            delay: settings.settings?.delay,
            complete: function () {
                self.revealElement.style.webkitTransformOrigin = self.revealElement.style.transformOrigin = self.transformSettings.origin.halfway;
                if (typeof settings.settings?.onCover === "function") {
                    settings.settings.onCover(self.contentElement, self.revealElement);
                };
                anime(animationStepTwo);
            }
        };

        if (settings.settings?.area !== undefined) {
            console.log("yay")
            if (settings.settings?.direction === "lr" || settings.settings?.direction === "rl") {
                animationStepOne.scaleX = [0, 1];
                animationStepTwo.scaleX = [1, settings.settings.area / 100];
            } else {
                animationStepOne.scaleY = [0, 1];
                animationStepTwo.scaleY = [1, settings.settings.area / 100]
            };
        };

        if (typeof settings.settings?.onStart === "function") {
            settings.settings?.onStart(self.contentElement, self.revealElement);
        };

        anime(animationStepOne);
    }

    _init() {
        this._layout();
        this._getTransformSettings(this.options?.settings?.direction);
    };
}

export default Reveal;