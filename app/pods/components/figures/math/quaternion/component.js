import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    controlDef = {
        interpolation: {
            amount: {
                min: 0,
                max: 1,
                default: 0,
            },
        },
    };

    createPointSamples(numSamples) {
        this.points1 = [];
        this.points2 = [];
        this.numSamples = numSamples;
        for (let i = 0; i < numSamples; i++) {
            const {dir1, dir2} = this.interpolate(i/numSamples);

            this.points1.push(dir1);
            this.points2.push(dir2);
        }
    }

    interpolate(amount) {
        const quaternion = this.quaternions.from.clone().slerp(this.quaternions.to, amount);
        const rotationX = amount * (this.rotations.to.x - this.rotations.from.x) + this.rotations.from.x;
        const rotationY = amount * (this.rotations.to.y - this.rotations.from.y) + this.rotations.from.y;
        const rotationZ = amount * (this.rotations.to.z - this.rotations.from.z) + this.rotations.from.z;
        const euler = new THREE.Euler(rotationX, rotationY, rotationZ);
        const dir1 = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion);
        const dir2 = new THREE.Vector3(1, 0, 0).applyEuler(euler);

        return {dir1, dir2};
    }

    updateGeometry(amount) {
        const numPoints = Math.floor(this.numSamples * amount);
        this.curve1.geometry.dispose();
        this.curve1.geometry = new THREE.BufferGeometry().setFromPoints(this.points1.slice(0, numPoints));
        this.curve2.geometry.dispose();
        this.curve2.geometry = new THREE.BufferGeometry().setFromPoints(this.points2.slice(0, numPoints));
    }

    @action
    onSceneInsert(scene) {
        this.sphere1 = new THREE.Mesh(
            new THREE.SphereBufferGeometry(1, 30, 30),
            new THREE.MeshPhongMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.2,
            })
        );
        this.sphere1.position.x = -2;

        this.sphere2 = new THREE.Mesh(
            new THREE.SphereBufferGeometry(1, 30, 30),
            new THREE.MeshPhongMaterial({
                color: 0x0000ff,
                transparent: true,
                opacity: 0.2,
            })
        );
        this.sphere2.position.x = 2;

        this.rotations = {
            from: new THREE.Euler(0, 0, 0),
            to: new THREE.Euler(-Math.PI/4, 3*Math.PI, Math.PI/6),
        };
        this.quaternions = {
            from: new THREE.Quaternion().setFromEuler(this.rotations.from),
            to: new THREE.Quaternion().setFromEuler(this.rotations.to),
        };

        const dir1 = new THREE.Vector3(1, 0, 0).applyEuler(this.rotations.from);
        const dir2 = new THREE.Vector3(1, 0, 0).applyEuler(this.rotations.from);

        this.arrow1 = new THREE.ArrowHelper(dir1, this.sphere1.position);
        this.arrow2 = new THREE.ArrowHelper(dir2, this.sphere2.position);

        this.curve1 = new THREE.Line();
        this.curve2 = new THREE.Line();
        this.sphere1.add(this.curve1);
        this.sphere2.add(this.curve2);

        scene.add(this.sphere1);
        scene.add(this.sphere2);
        scene.add(this.arrow1);
        scene.add(this.arrow2);

        scene.add(new THREE.GridHelper(10, 10, 0xff0000));

        this.createPointSamples(50);
    }

    @action
    onControlChanged(prop, value) {
        const {dir1, dir2} = this.interpolate(value);

        this.arrow1.setDirection(dir1);
        this.arrow2.setDirection(dir2);

        this.updateGeometry(value);
    }
}
