import SceneObject from 'fundamentals/pods/components/scene-object/component';
import { action } from '@ember/object';
import THREE, { MathUtils } from 'three';

export default class extends SceneObject {
    properties = ['rotateX', 'rotateY', 'rotateZ'];

    buildObject() {
        this.object = new THREE.Group();

        this.ring1 = new THREE.Mesh(
            new THREE.TorusBufferGeometry(5, 0.1, 16, 100),
            new THREE.MeshPhongMaterial({
                color: 0xff0000,
                flatShading: true,
                emissive: 0xff0000,
            })
        );

        this.ring2 = new THREE.Mesh(
            new THREE.TorusBufferGeometry(5, 0.1, 16, 100),
            new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                flatShading: true,
                emissive: 0x00ff00,
            })
        );

        this.ring3 = new THREE.Mesh(
            new THREE.TorusBufferGeometry(5, 0.1, 16, 100),
            new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                flatShading: true,
                emissive: 0x0000ff,
            })
        );

        this.ring1.geometry.rotateX(Math.PI / 2);
        this.ring2.geometry.rotateY(Math.PI / 2);

        this.ring1.add(this.ring2);
        this.ring2.add(this.ring3);

        this.object.add(this.ring1);
        return this.object;
    }

    @action
    updateArg(prop, value) {
        switch (prop) {
            case 'rotateX':
                this.ring1.rotation.set(MathUtils.degToRad(value), 0, 0);
                break;
            case 'rotateY':
                this.ring3.rotation.set(0, MathUtils.degToRad(value), 0);
                break;
            case 'rotateZ':
                this.ring2.rotation.set(0, 0, MathUtils.degToRad(value));
                break;
        }
    }
}
