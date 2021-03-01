import Controller from '@ember/controller'
import {action} from '@ember/object'
import {tracked} from '@glimmer/tracking'
import THREE from 'three'

function runCode (editorValue, scene, THREE) {
    return Function(`"use strict"; return (${editorValue})`)()(scene, THREE)
}

export default class TestController extends Controller {
    object = new THREE.Object3D()
    scene = null

    editorValue = 
`function (scene, THREE) {
}`

    @action
    onSceneInsert (scene) {
        this.scene = scene
        this.scene.add(this.object)
    }

    @action
    onEditorUpdated (value) {
        this.scene.remove(this.object)
        this.object.clear()

        try {
            runCode(value, this.object, THREE)
        } catch (e) {
            console.log('user code failed to eval')
        }

        console.log(this.scene.children)
        this.scene.add(this.object)
    }
}