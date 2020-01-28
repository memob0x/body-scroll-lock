# Body Scroll Lock

A **CSS variables** based technique to **lock body scroll** with **iOS safari** "quirkness" and **scrollbar width** in mind.
Please note that this library does barely nothing under the hood, during its use it just writes and updates two global css variables and toggles a css class, this way you'll be able to lock the body scroll with the [css rules you prefer](#usage-pt1-css).

## The Backstory

The **proper way** to lock body scroll has always been putting `overflow: hidden;` **on body element**, but unfortunately this approach **just doesn't work on iOS safari**. 🙅<br>
The cleanest way to overcome this unfortunate situation would be [preventing `touchmove` events](https://github.com/willmcpo/body-scroll-lock), but you might still have **issues** with some **`viewport` configurations** along with **pinch to zoom** taking place or **iOS navigation bars** covering your elements.<br>
Since **this script** is more of a tool to programmatically assign some css rules, I always considered this approach the most convenient solution: no event listeners to register/unregister; no scrollable inner-elements to keep in mind, no problems. ✌<br>
An halfway solution would be using the css `touch-action` property, but, again, [**safari doesn't** seem to **support it**](https://bugs.webkit.org/show_bug.cgi?id=133112) any time soon 🙄, so...

## Usage Pt.1: CSS

When [locking](#usage-pt2-javascript), two css variables, `--body-scroll-scroll-y` and `--body-scroll-scrollbar-width`, are programmatically set at `:root` level, making the css aware of the **window scroll position** and the **browser scrollbar width**, while a `body-scroll-locked` css class is assigned to the `html` element.

These interventions alone are enough to ensure a cross-browser body scroll lock as it follows:

```css
html.body-scroll-locked {
    position: fixed;
    top: calc(var(--body-scroll-scroll-y) * -1);
    left: 0;
    width: calc(100vw - var(--body-scroll-scrollbar-width));
}
```

Please note that some [browser recognition logic](https://gist.github.com/memob0x/0869e759887441b1349fdfe6bf5a188d) can be applied in order to address iOS more specifically, keeping the standard overflow approach for standard browsers:

```css
/* iOS body lock: applies position fixed hack */
html.body-scroll-locked.iOS-browser-sniffing-example {
    position: fixed;
    top: calc(var(--body-scroll-scroll-y) * -1);
    left: 0;
}

/* standard browsers body lock */
html.body-scroll-locked:not(.iOS-browser-sniffing-example) body {
    overflow: hidden;
}

/* both: avoids contents jump */
html.body-scroll-locked {
    width: calc(100vw - var(--body-scroll-scrollbar-width));
}
```

## Usage Pt.2: JavaScript

The inclusion of **body-scroll.js** sets a global **bodyScroll** variable, which is basically an `Object` with some `methods` in it.

To **lock** the body scroll simply call the `lock` method.

```javascript
window.bodyScroll.lock(); // freeze!
```

To **unlock** it, call the `unlock` one.

```javascript
window.bodyScroll.unlock(); // scroll free, little bird.
```

A **isLocked** method can retrieve the actual body scroll lock status.

```javascript
const status = window.bodyScroll.isLocked(); // true when locked...
```

Lazy? Just `toggle` it...

```javascript
window.bodyScroll.toggle(); // locks if unlocked, unlocks if locked!
```

## Events

Get notified when scroll **state changes** listening to `bodyScrollLock` and `bodyScrollUnlock` **events**.

```javascript
window.addEventListener("bodyScrollLock", () =>
    console.log("The body scroll has been locked by someone, somewhere...")
);

window.addEventListener("bodyScrollUnlock", () =>
    console.log("Body scroll has been unlocked by someone, somewhere...")
);
```

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested; if you want to listen to the library [events](#events) in _Internet Explorer 11_ you'll need to include a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill) polyfill.
A Css Variables polyfill is not mandatory, it depends on how graceful you want to degrade your application on [old browsers](https://caniuse.com/#feat=css-variables)... 🙄

## Demo

Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demo/) to check if this is what you're looking for. 🤞
