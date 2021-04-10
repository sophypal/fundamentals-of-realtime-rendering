import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';
import { tracked } from '@glimmer/tracking';

class ObscuraDef {
    @tracked
    imagePlaneDistance = 0;
}

export default class extends Component {
    object = new THREE.Group();
    imagePlane = null;
    fov = null;
    invertedFov = null;

    controlDef = {
        Obscura: {
            imagePlaneDistance: {
                min: 0,
                max: 4,
                default: 0,
            },
        },
    };

    controlData = new ObscuraDef();

    @action
    onSceneInsert(scene) {
        const box = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
            depthTest: true,
            depthWrite: false,
        });
        const obscura = new THREE.Mesh(box, material);
        this.imagePlane = new THREE.Mesh(
            new THREE.BoxGeometry(5, 5, 0.1),
            new THREE.MeshBasicMaterial({
                color: 0x0000ff,
                side: THREE.DoubleSide,
            })
        );
        this.imagePlane.position.z = -2.5;

        this.updateFov(0);
        this.object.add(obscura);
        this.object.add(this.imagePlane);
        this.object.add(this.fov);
        this.object.add(this.invertedFov);

        this.fov.renderOrder = 1;
        this.imagePlane.renderOrder = 2;
        obscura.renderOrder = 3;

        scene.add(this.object);
    }

    updateFov(distance) {
        const height = 5 - distance;

        if (this.fov) {
            this.fov.geometry.dispose();
            this.invertedFov.geometry.dispose();
        } else {
            const mat = new THREE.MeshBasicMaterial({
                color: 0xff0000,
            });
            this.fov = new THREE.Mesh();
            this.fov.material = mat;

            this.invertedFov = this.fov.clone();
        }

        const geometry = new THREE.ConeGeometry(2.5, height, 32);

        this.fov.geometry = geometry;
        this.invertedFov.geometry = geometry;

        this.fov.rotation.x = Math.PI / 2;
        this.fov.position.z = distance / 2;

        this.invertedFov.rotation.x = -Math.PI / 2;
        this.invertedFov.position.z = distance / 2 + height;
    }

    @action
    onControlChanged(prop, value) {
        this.imagePlane.position.set(0, 0, -2.5 + value);
        this.updateFov(value);
    }
}
