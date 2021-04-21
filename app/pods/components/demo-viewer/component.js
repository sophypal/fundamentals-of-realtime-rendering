import Component from '@glimmer/component';
import THREE from 'three';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { run } from '@ember/runloop';
import * as dat from 'dat.gui';
import TWEEN from '@tweenjs/tween.js';
import _ from 'lodash';
import { isNone, isPresent } from '@ember/utils';

function runCode(editorValue, THREE, scene, camera, animate) {
    return Function(
        `"use strict"; return (function (THREE, scene, camera, vertexShaderSource, fragmentShaderSource, animate) {${editorValue.scene}})`
    )()(THREE, scene, camera, editorValue.vertex, editorValue.fragment, animate);
}

class EditorValues {
    @tracked
    scene;

    @tracked
    vertex;

    @tracked
    fragment;
}

export default class extends Component {
    object = new THREE.Object3D();
    scene = null;
    animations = [];
    animatedProps = {};
    animCallback = null;
    raf = null;

    @tracked
    currentTab = 'scene';

    @tracked
    isFullscreen = false;

    @tracked
    isPlaying = false;

    @tracked
    hasLights = true;

    editorValue = new EditorValues();

    get container() {
        return this.args.container || '.scroll-container';
    }

    get isFullscreenEnabled() {
        return this.args.isFullscreenEnabled === undefined ? true : this.args.isFullscreenEnabled;
    }

    get enabledEditors() {
        return {
            scene: !isNone(this.args.sceneEditorValue),
            vertex: !isNone(this.args.vertexEditorValue),
            fragment: !isNone(this.args.fragmentEditorValue),
        };
    }

    get showEditor() {
        // eslint-disable-next-line
        return this.isFullscreen && (this.enabledEditors.scene || this.enabledEditors.vertex || this.enabledEditors.fragment) || this.args.isFullSize;
    }

    get hasAnimation() {
        return isPresent(this.args.animations);
    }

    constructor() {
        super(...arguments);

        this.editorValue.scene = '/* globals THREE, scene, camera, vertexShadersource, fragmentShaderSource, animate */\n'.concat(
            this.args.sceneEditorValue
        );
        this.editorValue.vertex = this.args.vertexEditorValue;
        this.editorValue.fragment = this.args.fragmentEditorValue;
    }

    willDestroy() {
        super.willDestroy();

        if (this.rafID) {
            cancelAnimationFrame(this.rafID);
        }
    }

    reloadScene() {
        try {
            this.cleanupResources(this.object);
        } catch (e) {
            console.error(e);
        } finally {
            this.scene.remove(this.object);
            this.object.clear();
            this.animCallback = null;
        }

        try {
            runCode(this.editorValue, THREE, this.object, this.camera, (cb) => {
                this.animCallback = cb;
            });
        } catch (e) {
            this.animCallback = null;
            this.sceneComponent.pauseThree();
            console.info('user code failed to eval', e);
        }

        this.scene.add(this.object);
        if (this.sceneComponent.raf === null) {
            this.sceneComponent.animate();
        }
    }

    cleanupResources(object) {
        object.traverse((child) => {
            if (child.material) {
                child.material.dispose();
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
        });
    }

    startDemo(scene) {
        if (!this.args.hdr && !this.args.overrideLights) {
            this.addLights(scene);
        }
        this.setupControls(this._element);
        this.setupAnimations();

        this.reloadScene();
        this.animate();
    }

    addLights(scene) {
        if (this.lights) {
            return;
        }

        const lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(-100, -200, -100);

        scene.add(lights[0]);
        scene.add(lights[1]);
        scene.add(lights[2]);

        this.lights = lights;
    }

    removeLights(scene) {
        this.lights.forEach((light) => {
            scene.remove(light);
        });
        this.lights = null;
    }

    setupControls(element) {
        if (isNone(this.args.controlDef)) {
            return;
        }

        this.gui = new dat.GUI();

        const oldParent = this.gui.domElement.parentElement;
        element.querySelector('.scene-controls').append(this.gui.domElement);

        if (oldParent.parentNode) {
            oldParent.parentNode.removeChild(oldParent);
        }

        if (this.args.controlDef) {
            Object.entries(this.args.controlDef).forEach(
                ([folderName, folderDef]) => {
                    const folder = this.gui.addFolder(folderName);

                    const data = Object.entries(folderDef).reduce(
                        (defaults, [prop, value]) => {
                            defaults[prop] = Array.isArray(value) ? value[0] : value.default;

                            return defaults;
                        },
                        {}
                    );

                    Object.entries(folderDef).forEach(([prop, value]) => {
                        let entry;
                        if (Array.isArray(value)) {
                            entry = folder.add(data, prop, value);
                        } else {
                            entry = folder.add(
                                data,
                                prop,
                                value.min,
                                value.max
                            );

                            if (value.step) {
                                entry.step(value.step);
                            }
                        }

                        entry.onChange(() => {
                            this.onControlChanged(`${folderName}.${prop}`, data[prop]);
                        });
                    });
                }
            );
        }
    }

    setupAnimations() {
        const keyframes = this.args.keyframes;
        const animations = this.args.animations;

        if (keyframes && animations) {
            Object.entries(animations).forEach(([name, animation]) => {
                const { keyframe, duration, easing } = animation;
                const { from, to } = keyframes[keyframe];
                const animatedProps = _.cloneDeep(from);

                const tween = new TWEEN.Tween(animatedProps)
                    .to(to, duration)
                    .easing(easing)
                    .onComplete(this.onComplete)
                    .onUpdate((obj, elapsed) => {
                        if (elapsed === 1 && !tween._repeat) {
                            tween._isPlaying = false;
                        }
                    });

                this.animatedProps[name] = animatedProps;
                this.animations.push(tween);
            });
        }

        this.animate();
    }

    @action
    onSceneInsert(scene, component) {
        this.scene = scene;
        this.sceneComponent = component;
        this.camera = component.camera;
        this.scene.add(this.object);

        this.startDemo(scene);

        if (this.args.onSceneInsert) {
            this.args.onSceneInsert(scene, component);
        }
    }

    @action
    onEditorUpdated(value) {
        this.editorValue[this.currentTab] = value;

        this.reloadScene();
    }

    @action
    onEnterFullscreen() {
        this.isFullscreen = true;
    }

    @action
    onExitFullscreen() {
        this.isFullscreen = false;
    }

    @action
    onFullscreenChange(isFullscreen) {
        if (isFullscreen !== this.isFullscreen) {
            this.isFullscreen = isFullscreen;
        }

        // fullscreenchange get's triggered before the fullscreen transition completes
        run.later(() => {
            this.sceneComponent.resize(this.sceneComponent.element);
        }, 100);
    }

    @action
    onDidInsert(element) {
        this._element = element;
    }

    @action
    onControlChanged(prop, value) {
        if (this.args.onControlChanged) {
            this.args.onControlChanged(prop, value);
        }

        this.animations.forEach((tween) => tween.pause());
        this.isPlaying = false;
    }

    @action
    animate(time) {
        this.raf = requestAnimationFrame(this.animate);

        TWEEN.update(time);

        if (this.isPlaying) {
            this.onAnimate(time);
        }

        if (this.animCallback && typeof this.animCallback === 'function') {
            this.animCallback.call(null, time);
        }
    }

    @action
    onAnimate() {
        if (this.args.onAnimate) {
            this.args.onAnimate(this.animatedProps);
        }
    }

    @action
    onComplete() {
        if (this.animations.every((tween) => !tween.isPlaying())) {
            this.isPlaying = false;
        }
    }

    @action
    onPlay() {
        this.animations.forEach((tween) => {
            if (tween.isPaused()) {
                tween.resume();
            } else {
                tween.start();
            }
        });
        this.isPlaying = true;
    }

    @action
    onPause() {
        this.animations.forEach((tween) => {
            tween.pause();
        });
        this.isPlaying = false;
    }

    @action
    onEditorTab(tab) {
        this.currentTab = tab;
    }

    @action
    onEnter(element) {
        this._element = element;
        // initially this will be called during scene initialization which alsos trigger animate
        // and I want to prevent using raf twice
        if (!this.raf) {
            this.animate();
        }
    }

    @action
    onLeave() {
        cancelAnimationFrame(this.raf);
        this.raf = null;
    }

    @action
    toggleLights() {
        this.hasLights = !this.hasLights;

        if (this.hasLights) {
            this.addLights(this.scene);
        } else {
            this.removeLights(this.scene);
        }
    }
}
