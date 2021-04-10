import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    controlDef = {
        dot: {
            angle: {
                min: -180,
                max: 180,
                default: 45,
            },
        },
    };

    updateAngle(angle) {
        this.vecB.setDirection(new THREE.Vector3(1, 0, 0).applyMatrix4(new THREE.Matrix4().makeRotationZ(angle * THREE.MathUtils.DEG2RAD)));

        if (this.arc) {
            this.arc.geometry.dispose();
        }

        const rads = THREE.MathUtils.degToRad(angle);
        const thetaStart = angle >= 0 ? 0 : (2 * Math.PI + rads);
        const thetaEnd = rads;
        const cos = (Math.cos(rads) + 1) / 2;

        this.arc.geometry = new THREE.CircleBufferGeometry(0.5, 35, thetaStart, Math.abs(thetaEnd));
        this.arc.material.color = new THREE.Color(cos, cos, cos);
    }

    @action
    onSceneInsert(scene) {
        const xyPlane = new THREE.GridHelper(100, 20);
        xyPlane.rotation.x = Math.PI / 2;

        this.vecA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0));
        this.vecB = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0));
        this.arc = new THREE.Mesh();
        this.arc.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});

        this.updateAngle(45);

        scene.add(xyPlane);
        scene.add(this.vecA);
        scene.add(this.vecB);
        scene.add(this.arc);
    }

    @action
    onControlChanged(prop, value) {
        this.updateAngle(value);
    }
}
