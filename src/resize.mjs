import { dispatchEvent } from "./client.mjs";

import { doLock, doUnlock } from "./state.mjs";

// the event name supplied to event listeners
const eventName = "resize";

// the events debounce time in milliseconds
export const debounceTime = 150;

// events handlers closure
// a weakmap is used in order to keep every handler associated with the scrollable element itself
const eventHandlers = new WeakMap();

/**
 * Handles (debounced) browser resize (implicity includes a possible device orientation change),
 * re-applies a consistent lock state when scroll is locked
 * and only then it dispatches a custom event
 * @param {HTMLElement} element
 * @returns {void} Nothing
 */
const createEventHandler = element => {
    let timer = null;
    
    return () => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            //
            timer = null;

            // toggling body scroll lock

            // gets rid of possible body scroll locked state
            // avoids useless computations when scroll is not locked
            if (!doUnlock(element)) {
                return;
            }

            // recalculates and rewrites lock state
            doLock(element);

            // dispatch a "resize during lock" notification
            dispatchEvent(element, eventName);
        }, debounceTime);
    }
};

// "passive" as event listeners only option
const options = true;

/**
 * Attach the window resize listener for a given element
 * @param {HTMLElement} element The given element
 * @returns {void} Nothing
 */
export const addResizeEventListener = element => {
    const eventHandler = createEventHandler(element);

    eventHandlers.set(element, eventHandler);

    window.addEventListener(eventName, eventHandler, options);
}

/**
 * Detach a previously attached window resize listener for a given element
 * @param {HTMLElement} element The given element
 * @returns {void} Nothing
 */
export const removeResizeEventListener = element => {
    const eventHandler = eventHandlers.get(element);

    eventHandlers.delete(element);

    window.removeEventListener(eventName, eventHandler, options);
}