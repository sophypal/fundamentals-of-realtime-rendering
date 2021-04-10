import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { later } from '@ember/runloop';

export default class extends Component {
    originalPos = {
        x: 1,
        y: 0,
        z: 0,
    };

    translate = {
        from: {},
        to: {
            x: 3,
            y: 0,
            z: 0,
        },
    };

    rotate = {
        from: {},
        to: {
            x: 0,
            y: 0,
            z: Math.PI / 2,
        },
    };

    initializeKeyframes() {
        this.translate.from.x = 0;
        this.translate.from.y = 0;
        this.translate.from.z = 0;

        this.rotate.from.x = 0;
        this.rotate.from.y = 0;
        this.rotate.from.z = 0;
    }

    leftToRight(scene) {
        const world = new THREE.GridHelper(100, 100, 0xff0000);
        const box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1));
        world.matrixAutoUpdate = false;
        box.matrixAutoUpdate = false;

        world.geometry.rotateX(Math.PI / 2);

        this.initializeKeyframes();
        const translateTween = new TWEEN.Tween(this.translate.from).to(this.translate.to, 2000);
        const rotateTween = new TWEEN.Tween(this.rotate.from).to(this.rotate.to, 2000);

        translateTween.chain(rotateTween);

        scene.add(world);
        rotateTween.onUpdate(() => {
            this.updateWorld(world);
        });
        translateTween.onUpdate(() => {
            this.updateWorld(world);
        });

        rotateTween.onComplete(() => {
            this.updateBox(box);
            scene.add(box);

            later(() => {
                scene.remove(box);
                this.initializeKeyframes();

                translateTween.start();
            }, 2000);
        });

        translateTween.start();
    }

    rightToLeft(scene) {
        const world = new THREE.GridHelper(100, 100, 0xff0000);
        const box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1));
        box.matrixAutoUpdate = false;

        world.geometry.rotateX(Math.PI / 2);

        this.initializeKeyframes()
        const translateTween = new TWEEN.Tween(this.translate.from).to(this.translate.to, 2000);
        const rotateTween = new TWEEN.Tween(this.rotate.from).to(this.rotate.to, 2000);

        rotateTween.chain(translateTween);

        scene.add(world);
        scene.add(box);

        rotateTween.onUpdate(() => {
            this.updateBox(box);
        });
        translateTween.onUpdate(() => {
            this.updateBox(box);
        });
        translateTween.onComplete(() => {
            later(() => {
                this.initializeKeyframes();
                rotateTween.start();
            }, 2000);
        });

        rotateTween.start();
    }

    updateBox(box) {
        const rotation = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(this.rotate.from.x, this.rotate.from.y, this.rotate.from.z));
        const translation = new THREE.Matrix4().makeTranslation(this.translate.from.x, this.translate.from.y, this.translate.from.z);
        const position = new THREE.Matrix4().makeTranslation(this.originalPos.x, this.originalPos.y, this.originalPos.z);

        box.matrix.identity();
        box.matrix.multiply(translation).multiply(rotation).multiply(position);
    }

    updateWorld(world) {
        const rotation = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(this.rotate.from.x, this.rotate.from.y, this.rotate.from.z));
        const translation = new THREE.Matrix4().makeTranslation(this.translate.from.x, this.translate.from.y, this.translate.from.z);

        world.matrix.identity();
        world.matrix.copy(translation).multiply(rotation);
    }

    @action
    onSceneInsert(scene) {
        if (this.args.props.mode === 'left-to-right') {
            this.leftToRight(scene);
        } else {
            this.rightToLeft(scene);
        }
    }
}
