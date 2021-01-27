import SceneObject from 'fundamentals/components/scene-object/component';
import THREE from 'three'

export default class GridHelper extends SceneObject {
    constructor () {
        super(...arguments)

        this.object.add(new THREE.GridHelper())
    }
}
