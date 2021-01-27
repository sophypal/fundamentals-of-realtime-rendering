import SceneObject from 'fundamentals/components/scene-object/component'
import {action} from '@ember/object'
import THREE from 'three'

export default class extends SceneObject {
    // internal state
    camera = null;
    glRenderer = null;
    
    defaults = {
        type: 'Scene'
    }

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

    @action
    animate () {
        requestAnimationFrame(this.animate);

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

        this.animate();
    }
}