import Modifier from 'ember-modifier';
import { action } from '@ember/object';
import { schedule } from '@ember/runloop';

export default class extends Modifier {
    isInViewport = false;
    container = null;

    checkIsInViewport() {
        const rect = this.element.getBoundingClientRect();

        return rect.top < window.innerHeight;
    }

    get onEnter() {
        return this.args.named.onEnter;
    }

    get onLeave() {
        return this.args.named.onLeave;
    }

    @action
    handleVisibility() {
        const isInViewport = this.checkIsInViewport();
        if (isInViewport && !this.isInViewport) {
            this.isInViewport = true;
            schedule('afterRender', () => {
                this.onEnter(this.element);
            });
        } else if (!isInViewport && this.isInViewport) {
            this.isInViewport = false;
            schedule('afterRender', () => {
                this.onLeave(this.element);
            });
        }
    }

    didInstall() {
        this.container = document.querySelector(this.args.named.container);

        if (this.container) {
            this.container.addEventListener('scroll', this.handleVisibility);
            this.handleVisibility();
        }
    }

    willDestroy() {
        if (this.container) {
            this.container.removeEventListener('scroll', this.handleVisibility);
        }
    }
}
