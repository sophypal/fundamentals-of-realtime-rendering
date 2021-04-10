import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    controlDef = {
        cross: {
            angle: {
                min: -180,
                max: 180,
                default: 45,
            },
        },
    };

    updateAngle(angle) {
        const dir = new THREE.Vector3(1, 0, 0).applyMatrix4(new THREE.Matrix4().makeRotationY(angle * THREE.MathUtils.DEG2RAD));
        this.vecB.setDirection(dir);

        const product = new THREE.Vector3(1, 0, 0).cross(dir);
        this.vecC.setDirection(product.clone().normalize());
        this.vecC.setLength(product.length());

        if (this.arc) {
            this.arc.geometry.dispose();
        }

        const rads = THREE.MathUtils.degToRad(angle);
        const thetaStart = angle >= 0 ? 0 : (2 * Math.PI + rads);
        const thetaEnd = rads;
        const sin = (Math.sin(rads) + 1) / 2;

        this.arc.geometry = new THREE.CircleBufferGeometry(0.5, 35, thetaStart, Math.abs(thetaEnd));
        this.arc.material.color = new THREE.Color(sin, sin, sin);
    }

    @action
    onSceneInsert(scene) {
        this.vecA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0));
        this.vecB = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0));
        this.vecC = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0));

        const axesHelper = new THREE.AxesHelper(5);

        this.arc = new THREE.Mesh();
        this.arc.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        });
        this.arc.rotation.x = -Math.PI / 2;

        this.updateAngle(45);

        scene.add(axesHelper);
        scene.add(this.vecA);
        scene.add(this.vecB);
        scene.add(this.vecC);
        scene.add(this.arc);
    }

    @action
    onControlChanged(prop, value) {
        this.updateAngle(value);
    }
}
