import SceneObject from 'fundamentals/pods/components/scene-object/component';
import { action } from '@ember/object';
import THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { tracked } from '@glimmer/tracking';

export default class extends SceneObject {
    camera = null;
    glRenderer = null;
    element = null;
    raf = null;
    loadingManager = new THREE.LoadingManager();
    loaders = {
        gltf: new GLTFLoader(this.loadingManager),
        rgbe: new RGBELoader(this.loadingManager),
        obj: new OBJLoader(this.loadingManager),
    };

    defaults = {
        type: 'Scene',
    };

    @tracked
    isLoading = false;

    @tracked
    loadingProgress = 0;

    constructor() {
        super(...arguments);

        this.loadingManager.onStart = this.onLoadingStarted;
        this.loadingManager.onLoad = this.onLoadingFinished;
        this.loadingManager.onProgress = this.onLoadingProgressed;
        this.loadingManager.onError = this.onLoadingErrored;
    }

    willDestroy() {
        super.willDestroy();
    }

    startThree() {
        if (!this.glRenderer) {
            this.setupThree(this.element);
            this.setupScene();

            if (this.args.onSceneInsert) {
                this.args.onSceneInsert(this.object, this);
            }
        }

        this.animate();
    }

    pauseThree() {
        cancelAnimationFrame(this.raf);
    }

    setupThree(element) {
        const { clientWidth, clientHeight } = element;
        this.camera = new THREE.PerspectiveCamera(
            60,
            clientWidth / clientHeight,
            0.1,
            1000
        );
        this.glRenderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.glRenderer.setPixelRatio(window.devicePixelRatio);
        this.glRenderer.setClearColor(0x333333);
        this.glRenderer.setSize(clientWidth, clientHeight);

        if (this.args.hdr) {
            this.glRenderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.glRenderer.toneMappingExposure = 1;
            this.glRenderer.outputEncoding = THREE.sRGBEncoding;
            this.glRenderer.physicalCorrectLights = true;
        }

        element.appendChild(this.glRenderer.domElement);

        this.orbit = new OrbitControls(this.camera, this.glRenderer.domElement);
        this.orbit.enableZoom = true;
    }

    setupScene() {
        if (this.args.cameraPosition) {
            const { x, y, z } = this.args.cameraPosition;
            this.camera.position.set(x, y, z);
        }

        if (this.args.cameraLookAt) {
            const { x, y, z } = this.args.cameraLookAt;
            this.camera.lookAt(x, y, z);
        }

        if (this.args.hdr) {
            this.setupEnvMap(this.args.hdr);
        }
        this.buildScene(this.loaders);
    }

    setupEnvMap({ map, background = true }) {
        const pmremGenerator = new THREE.PMREMGenerator(this.glRenderer);
        pmremGenerator.compileEquirectangularShader();

        this.loaders.rgbe
            .setDataType(THREE.UnsignedByteType)
            // .setPath('/textures/equirectangular/')
            // .load('royal_esplanade_1k.hdr', (texture) => {
            .load(map, (texture) => {
                const envMap = pmremGenerator.fromEquirectangular(texture)
                    .texture;

                if (background) {
                    this.object.background = envMap;
                }

                this.object.environment = envMap;

                texture.dispose();
                pmremGenerator.dispose();
            });
    }

    @action
    animate() {
        this.raf = requestAnimationFrame(this.animate);

        this.glRenderer.render(this.object, this.camera);
    }

    @action
    resize(element) {
        const { clientWidth, clientHeight } = element;
        this.camera.aspect = clientWidth / clientHeight;
        this.camera.updateProjectionMatrix();
        this.glRenderer.setSize(clientWidth, clientHeight);
    }

    @action
    didInsert(element) {
        this.element = element;
    }

    @action
    onEnter(element) {
        this.element = element;
        this.startThree();
    }

    @action
    onLeave() {
        this.pauseThree();
    }

    @action
    onLoadingStarted() {
        this.isLoading = true;
    }

    @action
    onLoadingFinished() {
        this.isLoading = false;
    }

    @action
    onLoadingProgressed(url, itemsLoaded, itemsTotal) {
        this.loadingProgress = (itemsLoaded / itemsTotal) * 100;
    }

    @action
    onLoadingErrored() {}
}
