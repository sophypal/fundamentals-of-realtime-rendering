import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    @action
    onSceneInsert(scene) {
        const grid = new THREE.GridHelper(10, 10);

        const axisHelper = new THREE.AxisHelper();

        scene.add(axisHelper);
        scene.add(grid);
    }
}
