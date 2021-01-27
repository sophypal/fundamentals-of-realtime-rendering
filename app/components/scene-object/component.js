import Component from '@glimmer/component';
import THREE from 'three'

export default class SceneObject extends Component {
    defaults = {
        type: 'Object3D'
    }

    get type () {
        const threeType = this.args.type || this.defaults['type']
        return THREE[threeType]
    }

    constructor () {
        super(...arguments);
        this.children = new Set();

        this.object = this.buildObject()

        if (this.args.parent) {
            this.args.parent.registerChild(this);
        }
    }

    willDestroy () {
        super.willDestroy(...arguments);

        this.args.parent.unregisterChild(this);
    }

    registerChild (child) {
        this.children.add(child)
    }

    unregisterChild (child) {
        this.children.remove(child)
    }


    buildScene () {
        this.children.forEach(child => {
            child.buildScene()

            this.object.add(child.object)
        })
    }

    destroyScene () {
        this.children.forEach(child => {
            child.destroyScene()

            this.object.remove(child.object)
        })
    }

    buildObject () {
        if (this.args.constructorProps) {
            return new this.type(...this.args.constructorProps)
        } else {
            return new this.type
        }
    }

    updateObject (props = {}) {
        Object.assign(this.object, props)
    }

}
