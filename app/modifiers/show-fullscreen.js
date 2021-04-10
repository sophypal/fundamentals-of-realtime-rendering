import Modifier from 'ember-modifier';
import { action } from '@ember/object';

export default class extends Modifier {
    initialized = false;

    get isFullscreen() {
        return this.args.named.isFullscreen;
    }

    @action
    onFullscreenChange() {
        if (this.args.named.onFullscreenChange) {
            this.args.named.onFullscreenChange(
                document.fullscreenElement !== null
            );
        }
    }

    didReceiveArguments() {
        if (this.isFullscreen) {
            this.element.requestFullscreen();
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        if (!this.initialized) {
            this.element.addEventListener(
                'fullscreenchange',
                this.onFullscreenChange,
                true
            );
        }
    }

    willDestroy() {
        this.element.removeEventListener(
            'fullscreenchange',
            this.onFullscreenChange
        );
    }
}
