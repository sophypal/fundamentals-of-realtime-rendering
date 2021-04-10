import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    @action
    onSceneInsert(scene) {
        const grid = new THREE.GridHelper(10, 10);
        grid.rotation.x = Math.PI/2;

        const box = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0xffff00})
        );
        box.position.set(1.5, 1.5, 0);

        const dirVec = new THREE.ArrowHelper(
            new THREE.Vector3(.707, .707, 0),
            new THREE.Vector3(0, 0, 0),
            1.414
        );

        scene.add(grid);
        scene.add(box);
        scene.add(dirVec);
    }
}
