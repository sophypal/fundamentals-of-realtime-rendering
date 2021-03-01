import SceneObject from 'fundamentals/components/scene-object/component'
import {action} from '@ember/object'
import THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import _ from 'lodash'

export default class extends SceneObject {
    // internal state
    camera = null;
    glRenderer = null;
    
    defaults = {
        type: 'Scene'
    }

    keyframes = []
    animations = []

    constructor () {
        super(...arguments)
    }

    setupThree (element) {
        const {clientWidth, clientHeight} = element;
        this.camera = new THREE.PerspectiveCamera(74, clientWidth / clientHeight, 0.1, 1000);
        this.glRenderer = new THREE.WebGLRenderer();
        this.glRenderer.setSize(clientWidth, clientHeight);
        element.appendChild(this.glRenderer.domElement);
    }

    setupScene () {
        if (this.args.cameraPosition) {
            const {x, y, z} = this.args.cameraPosition
            this.camera.position.set(x, y, z)
        }

        if (this.args.cameraLookAt) {
            const {x, y, z} = this.args.cameraLookAt
            this.camera.lookAt(x, y, z)
        }

        this.buildScene()
    }

    cacheKeyframes () {
        this.traverse(component => {
            if (component.args.keyframes) {
                this.keyframes.push({
                    component,
                    kf: _.cloneDeep(component.args.keyframes)
                })
            }
        })

        this.keyframes.forEach(kf => {
            this.animations.push(this.buildAnimation(kf))
        })
    }

    buildAnimation ({component, kf}) {
        const {from, to} = kf
        const tweens = []

        Object.keys(from).forEach(key => {

            const tween = new TWEEN.Tween(from)
                .to(to, kf.duration) 
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => {
                    component.updateObject(component.object, from)
                })
                .start()

            tweens.push(tween)
        })

        return tweens
    }

    @action
    animate (time) {
        requestAnimationFrame(this.animate);
        TWEEN.update(time)
        this.glRenderer.render(this.object, this.camera);
    }

    @action
    resize (element) {
        const {clientWidth, clientHeight} = element;
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
        this.glRenderer.setSize(clientWidth, clientHeight)
    }

    @action
    didInsert (element) {
        this.setupThree(element)
        this.setupScene()

        this.cacheKeyframes()

        if (this.args.onSceneInsert) {
            this.args.onSceneInsert(this.object)
        }

        this.animate()
    }
}