import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
    @tracked rectangular = '(1 + 0\\boldsymbol{i}) \\times \\boldsymbol{e}^{\\boldsymbol{i}(0 \\degree)} = (1 + 0\\boldsymbol{i})';

    controlDef = {
        rotation: {
            angle: {
                min: -180,
                max: 180,
                default: 0,
            },
        },
    };

    @action
    onSceneInsert(scene) {
        const grid = new THREE.GridHelper(2, 10);
        grid.rotation.x = Math.PI / 2;

        this.vector = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0));

        scene.add(grid);
        scene.add(this.vector);
    }

    @action
    onControlChanged(prop, value) {
        const theta = value * THREE.MathUtils.DEG2RAD;
        const rot = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);

        this.vector.setDirection(rot);

        this.rectangular = `(1 + 0\\boldsymbol{i}) \\times \\boldsymbol{e}^{\\boldsymbol{i}(${value.toFixed(2)} \\degree)} = (${rot.x.toFixed(2)} + ${rot.y.toFixed(2)}\\boldsymbol{i})`;
    }
}
