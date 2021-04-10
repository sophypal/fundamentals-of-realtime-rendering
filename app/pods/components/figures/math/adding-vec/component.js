import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    controlDef = {
        'Vector A': {
            x: {
                min: -5,
                max: 5,
                default: 1,
            },
            y: {
                min: -5,
                max: 5,
                default: 0,
            },
            z: {
                min: -5,
                max: 5,
                default: 0,
            },
        },
        'Vector B': {
            x: {
                min: -5,
                max: 5,
                default: 0,
            },
            y: {
                min: -5,
                max: 5,
                default: 1,
            },
            z: {
                min: -5,
                max: 5,
                default: 0,
            },
        },
    };

    createObjects(group) {
        this.aObject = new THREE.ArrowHelper(
            this.a.clone().normalize(),
            new THREE.Vector3(0, 0, 0),
            this.a.length(),
            0xff0000
        );
        this.bObject = new THREE.ArrowHelper(this.b.clone().normalize(), this.a, this.b.length(), 0x00ff00);

        const c = this.a.clone().add(this.b);
        this.cObject = new THREE.ArrowHelper(
            c.clone().normalize(),
            new THREE.Vector3(0, 0, 0),
            c.length(),
            0xffff00
        );

        group.add(this.aObject);
        group.add(this.bObject);
        group.add(this.cObject);
    }

    @action
    onSceneInsert(scene) {
        this.a = new THREE.Vector3(1, 0, 0);
        this.b = new THREE.Vector3(0, 1, 0);

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
            case 'Vector A.x':
                this.a.x = value;
                break;
            case 'Vector A.y':
                this.a.y = value;
                break;
            case 'Vector A.z':
                this.a.z = value;
                break;
            case 'Vector B.x':
                this.b.x = value;
                break;
            case 'Vector B.y':
                this.b.y = value;
                break;
            case 'Vector B.z':
                this.b.z = value;
                break;
        }

        this.aObject.line.geometry.dispose();
        this.aObject.cone.geometry.dispose();
        this.bObject.line.geometry.dispose();
        this.bObject.cone.geometry.dispose();

        this.group.clear();
        this.createObjects(this.group);
    }
}
