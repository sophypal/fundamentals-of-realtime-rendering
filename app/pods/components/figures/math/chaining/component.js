import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE, { MeshPhongMaterial } from 'three';

export default class extends Component {
    translation = new THREE.Vector3();
    rotation = new THREE.Euler();
    scale = new THREE.Vector3(1, 1, 1);
    order = 'trs';

    controlDef = {
        translate: {
            x: {
                min: -5,
                max: 5,
                default: 0,
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
        rotate: {
            x: {
                min: -180,
                max: 180,
                default: 0,
            },
            y: {
                min: -180,
                max: 180,
                default: 0,
            },
            z: {
                min: -180,
                max: 180,
                default: 0,
            },
        },
        scale: {
            x: {
                min: -5,
                max: 5,
                default: 1,
            },
            y: {
                min: -5,
                max: 5,
                default: 1,
            },
            z: {
                min: -5,
                max: 5,
                default: 1,
            },
        },
        chaining: {
            order: ['trs', 'rst'],
        },
    };

    changeTransform(order, translation, rotation, scale) {
        const transform = new THREE.Matrix4();
        const translate = new THREE.Matrix4().makeTranslation(translation.x, translation.y, translation.z);
        const rotate = new THREE.Matrix4().makeRotationFromEuler(rotation);
        const _scale = new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z);

        switch (order) {
            case 'trs':
                transform.multiply(translate).multiply(rotate).multiply(_scale);
                break;
            case 'rst':
                transform.multiply(rotate).multiply(_scale).multiply(translate);
                break;
        }

        this.box.rotation.set(0, 0, 0);
        this.box.position.set(0, 0, 0);
        this.box.scale.set(1, 1, 1);

        this.box.applyMatrix4(transform);
    }

    @action
    onSceneInsert(scene) {
        this.box = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1, 1, 1),
            new MeshPhongMaterial({
                color: 0x0000ff,
            })
        );

        scene.add(this.box);
    }

    @action
    onControlChanged(prop, value) {
        switch (prop) {
            case 'translate.x':
                this.translation.x = value;
                break;
            case 'translate.y':
                this.translation.y = value;
                break;
            case 'translate.z':
                this.translation.z = value;
                break;
            case 'rotate.x':
                this.rotation.x = value * THREE.MathUtils.DEG2RAD;
                break;
            case 'rotate.y':
                this.rotation.y = value * THREE.MathUtils.DEG2RAD;
                break;
            case 'rotate.z':
                this.rotation.z = value * THREE.MathUtils.DEG2RAD;
                break;
            case 'scale.x':
                this.scale.x = value;
                break;
            case 'scale.y':
                this.scale.y = value;
                break;
            case 'scale.z':
                this.scale.z = value;
                break;
            case 'chaining.order':
                this.order = value;
                break;
        }

        this.changeTransform(this.order, this.translation, this.rotation, this.scale);
    }
}