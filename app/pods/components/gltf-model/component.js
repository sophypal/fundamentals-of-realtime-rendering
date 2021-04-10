import SceneObject from 'fundamentals/pods/components/scene-object/component';
import THREE from 'three';

export default class extends SceneObject {
    constructor() {
        super(...arguments);
    }

    buildObject(loaders) {
        this.object = new THREE.Object3D();
        loaders.gltf.load(this.args.modelSrc, (gltf) => {
            this.object.add(gltf.scene);
        });

        if (this.args.modelPosition) {
            this.object.position.fromArray(this.args.modelPosition);
        }

        if (this.args.modelRotation) {
            const rads = this.args.modelRotation.map((angle) => {
                return angle * THREE.MathUtils.DEG2RAD;
            });
            this.object.rotation.fromArray(rads);
        }

        return this.object;
    }
}
