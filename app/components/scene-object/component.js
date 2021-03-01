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

    get props () {
        if (this.args.keyframes) {
            return this.args.keyframes.from
        } else {
            return this.args.props
        }
    }

    constructor () {
        super(...arguments);
        this.children = new Set();


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

    traverse (iter) {
        this.children.forEach(child => {
            iter(child)

            child.traverse(iter)
        })
    }

    buildScene () {
        this.object = this.buildObject()
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
        let object
        if (this.args.constructorProps) {
            object = new this.type(...this.args.constructorProps)
        } else {
            object = new this.type
        }

        if (this.props) {
            this.updateObject(object, this.props)
        }

        return object
    }

    updateObject (object, props = {}) {
        Object.entries(props).forEach(([key, value]) => {
            switch (key) {
                case 'position':
                case 'rotation':
                    object[key].set(value.x, value.y, value.z)
                    break
            }
        }) 
    }

}
