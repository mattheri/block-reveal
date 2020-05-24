import anime from "animejs";
var Reveal = /** @class */ (function () {
    function Reveal(element, options) {
        this.element = element;
        this.options = options;
        this.transformSettings;
        this.contentElement;
        this.revealElement;
        this.animating;
        this.init = this._init();
    }
    Reveal.prototype._layout = function () {
        var _a;
        var position = getComputedStyle(this.element).position;
        if (position !== "fixed" && position !== "absolute" && position !== "relative") {
            this.element.style.position = "relative";
        }
        ;
        var contentElement = this._createElement("div", "block_content", this.element.innerHTML);
        var revealElement = this._createElement("div", "block_revealer");
        this.contentElement = contentElement;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.hidden)
            this.contentElement.style.opacity = "0";
        this.revealElement = revealElement;
        this.element.innerHTML = "";
        this.element.appendChild(contentElement);
        this.element.appendChild(revealElement);
    };
    Reveal.prototype._createElement = function (tag, className, content) {
        var element = document.createElement(tag);
        element.className = className || "";
        element.innerHTML = content || "";
        return element;
    };
    Reveal.prototype._getTransformSettings = function (direction) {
        var settings = {
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
        };
        if (direction) {
            this.transformSettings = {
                val: settings[direction].val,
                origin: {
                    initial: settings[direction].origin,
                    halfway: settings[direction].origin2
                }
            };
        }
        else {
            this.transformSettings = {
                val: settings.default.val,
                origin: {
                    initial: settings.default.origin,
                    halfway: settings.default.origin2
                }
            };
        }
        ;
    };
    Reveal.prototype.reveal = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (this.animating) {
            return false;
        }
        this.animating = true;
        var defaults = {
            hidden: true,
            settings: {
                area: 0,
                bgColor: "#000000",
                direction: "lr",
                duration: 500,
                easing: "easeInOutExpo",
                delay: 0,
                onCover: function (contentElement, revealElement) { return false; },
                onStart: function (contentElement, revealElement) { return false; },
                onComplete: function (contentElement, revealElement) { return false; }
            }
        };
        var settings = defaults;
        for (var i in settings) {
            if (this.options) {
                if (i === "hidden") {
                    settings[i] = this.options[i] !== undefined ? this.options[i] : settings[i];
                }
            }
            ;
        }
        ;
        for (var i in settings.settings) {
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.settings) {
                settings.settings[i] = this.options.settings[i] !== undefined ? this.options.settings[i] : settings.settings[i];
            }
            ;
        }
        ;
        if ((_b = settings.settings) === null || _b === void 0 ? void 0 : _b.bgColor)
            this.revealElement.style.background = settings.settings.bgColor;
        this.revealElement.style.opacity = "1";
        this.revealElement.style.position = "absolute";
        this.revealElement.style.left = "0";
        this.revealElement.style.top = "0";
        this.revealElement.style.width = "100%";
        this.revealElement.style.height = "100%";
        this.revealElement.style.zIndex = "1000";
        this.revealElement.style.webkitTransform = this.revealElement.style.transform = this.transformSettings.val;
        this.revealElement.style.webkitTransformOrigin = this.revealElement.style.transformOrigin = this.transformSettings.origin.initial;
        var self = this;
        ;
        var animationStepTwo = {
            targets: this.revealElement,
            duration: (_c = settings.settings) === null || _c === void 0 ? void 0 : _c.duration,
            easing: (_d = settings.settings) === null || _d === void 0 ? void 0 : _d.easing,
            update: function (animation) {
                if (animation.progress > 1) {
                    self.contentElement.style.opacity = "1";
                }
            },
            complete: function () {
                var _a;
                self.animating = false;
                if (typeof ((_a = settings.settings) === null || _a === void 0 ? void 0 : _a.onComplete) === "function") {
                    settings.settings.onComplete(self.contentElement, self.revealElement);
                }
                ;
            }
        };
        var animationStepOne = {
            targets: this.revealElement,
            duration: (_e = settings.settings) === null || _e === void 0 ? void 0 : _e.duration,
            easing: (_f = settings.settings) === null || _f === void 0 ? void 0 : _f.easing,
            delay: (_g = settings.settings) === null || _g === void 0 ? void 0 : _g.delay,
            complete: function () {
                var _a;
                self.revealElement.style.webkitTransformOrigin = self.revealElement.style.transformOrigin = self.transformSettings.origin.halfway;
                if (typeof ((_a = settings.settings) === null || _a === void 0 ? void 0 : _a.onCover) === "function") {
                    settings.settings.onCover(self.contentElement, self.revealElement);
                }
                ;
                anime(animationStepTwo);
            }
        };
        if (((_h = settings.settings) === null || _h === void 0 ? void 0 : _h.area) !== undefined) {
            console.log("yay");
            if (((_j = settings.settings) === null || _j === void 0 ? void 0 : _j.direction) === "lr" || ((_k = settings.settings) === null || _k === void 0 ? void 0 : _k.direction) === "rl") {
                animationStepOne.scaleX = [0, 1];
                animationStepTwo.scaleX = [1, settings.settings.area / 100];
            }
            else {
                animationStepOne.scaleY = [0, 1];
                animationStepTwo.scaleY = [1, settings.settings.area / 100];
            }
            ;
        }
        ;
        if (typeof ((_l = settings.settings) === null || _l === void 0 ? void 0 : _l.onStart) === "function") {
            (_m = settings.settings) === null || _m === void 0 ? void 0 : _m.onStart(self.contentElement, self.revealElement);
        }
        ;
        anime(animationStepOne);
    };
    Reveal.prototype._init = function () {
        var _a, _b;
        this._layout();
        this._getTransformSettings((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.direction);
    };
    ;
    return Reveal;
}());
export default Reveal;
