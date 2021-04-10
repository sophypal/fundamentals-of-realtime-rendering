import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    controlDef = {
        'Transform': {
            'scalar factor': {
                min: -5,
                max: 5,
                default: 1,
            },
        },
    };

    createObjects(group) {
        this.object = new THREE.ArrowHelper(
            this.vector.clone().normalize(),
            new THREE.Vector3(0, 0, 0),
            this.vector.length(),
            0xff0000
        );

        group.add(this.object);
    }

    @action
    onSceneInsert(scene) {
        this.vector = new THREE.Vector3(.707, .707, 0);
        this.scale = 1;

        this.xyPlane = new THREE.GridHelper(100, 20);
        this.xyPlane.rotation.x = Math.PI / 2;

        this.xzPlane = new THREE.GridHelper(100, 20);

        scene.add(new THREE.AxesHelper(5));
        scene.add(this.xzPlane);
        scene.add(this.xyPlane);

        this.group = new THREE.Group();

        this.createObjects(this.group);

        scene.add(this.group);
    }

    @action
    onControlChanged(prop, value) {
        switch (prop) {
            case 'Transform.scalar factor':
                this.scale = value;
                break;
        }

        this.vector = new THREE.Vector3(0.707, 0.707, 0).multiplyScalar(this.scale);
        this.object.line.geometry.dispose();
        this.object.cone.geometry.dispose();

        this.group.clear();
        this.createObjects(this.group);
    }
}
