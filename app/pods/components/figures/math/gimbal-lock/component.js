import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import TWEEN from '@tweenjs/tween.js';

class GimbalControlDef {
    @tracked rotateX = 0;
    @tracked rotateY = 0;
    @tracked rotateZ = 0;
}

export default class extends Component {
    controlDef = {
        Gimbal: {
            rotateX: {
                min: 0,
                max: 360,
                default: 0,
            },
            rotateY: {
                min: 0,
                max: 360,
                default: 0,
            },
            rotateZ: {
                min: 0,
                max: 360,
                default: 0,
            },
        },
    };

    @tracked
    controlData = new GimbalControlDef();

    @action
    onControlChanged(prop, value) {
        const rotateProp = prop.replace('Gimbal.', '');
        this.controlData[rotateProp] = value;
    }
}
