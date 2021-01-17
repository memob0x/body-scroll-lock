import Padlock from '../src/padlock.mjs';

import { EVENT_NAME_SCROLL, EVENT_NAME_RESIZE } from '../src/client.mjs';

import { createDiv, documentElement, body, isPadlockElement, dispatchCustomEvent } from './_tests.mjs';

describe('padlock', () => {    
    let expander;
    let scroller;

    beforeEach(() => {
        expander = createDiv();

        const expanderStyle = expander.style;

        expanderStyle.width = expanderStyle.height = '2000px';
        
        scroller = createDiv();

        const scrollerStyle = scroller.style;

        scrollerStyle.width = scrollerStyle.height = '100px';

        scrollerStyle.overflow = 'auto';
    });

    afterEach(() => expander.remove());

    it('should be able to create an instance and throw if incorrect arguments are passed', () => {
        // invalid element
        expect(() => void new Padlock(null)).to.throw(TypeError);

        // invalid class
        expect(() => void new Padlock(createDiv(), '')).to.throw(TypeError);
        expect(() => void new Padlock(createDiv(), null)).to.throw(TypeError);

        // same el instance throws
        expect(() => {
            const div = createDiv();
            
            void new Padlock(div);
            void new Padlock(div);
        }).to.throw(Error);

        // same el instance doesn't throw if instance is destroyed
        expect(() => {
            const div = createDiv();
            
            let instance = new Padlock(div);

            instance.destroy();

            instance = new Padlock(div);

            instance.destroy();
        }).to.not.throw(Error);

        expect(() => {            
            // no element given = global scroller = <html> element
            let instance = new Padlock();

            expect(isPadlockElement(documentElement));

            instance.destroy();

            // <body> given = global scroller = <html> element
            instance = new Padlock(body);

            expect(isPadlockElement(documentElement));

            instance.destroy();
        }).to.not.throw(Error);
    });
    
    // TODO: test resize on element
    // TODO: test resize on global
    // TODO: test scroll on element
    // TODO: test scroll on global
    
    // TODO: test scroll getter on element
    // TODO: test scroll setter on element

    // TODO: test scroll getter on element
    // TODO: test scroll setter on global

    // TODO: test layout getter on element
    // TODO: test layout getter on global

    it('destroy method should avoid further computations or DOM changes', () => {
        const div = createDiv();

        const instance = new Padlock(div);

        expect(isPadlockElement(div)).to.be.true;

        instance.destroy();

        expect(isPadlockElement(div)).to.be.false;

        dispatchCustomEvent(div, EVENT_NAME_SCROLL);

        expect(isPadlockElement(div)).to.be.false;

        dispatchCustomEvent(div, EVENT_NAME_RESIZE);

        expect(isPadlockElement(div)).to.be.false;

        instance.update();

        expect(isPadlockElement(div)).to.be.false;
    });

    it('should update values through update method', () => {
        body.append(scroller);

        const instance = new Padlock(scroller);
        
        const { layout } = instance;

        scroller.append(expander);
        
        expect(layout).to.deep.equals(instance.layout);

        instance.update();
        
        expect(layout).to.not.deep.equals(instance.layout);

        scroller.remove();
    });
});
