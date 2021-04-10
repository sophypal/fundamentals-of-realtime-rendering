import Component from '@glimmer/component';
import THREE from 'three';
import { action } from '@ember/object';

export default class SceneObject extends Component {
    defaults = {
        type: 'Object3D',
    };

    properties = [];

    get type() {
        const threeType = this.args.type || this.defaults['type'];
        return THREE[threeType];
    }

    get props() {
        return this.args.props;
    }

    constructor() {
        super(...arguments);
        this.children = new Set();

        if (this.args.parent) {
            this.args.parent.registerChild(this);
        }
    }

    willDestroy() {
        super.willDestroy(...arguments);

        if (this.args.parent) {
            this.args.parent.unregisterChild(this);
        }
    }

    registerChild(child) {
        this.children.add(child);
    }

    unregisterChild(child) {
        this.children.delete(child);
    }

    traverse(iter) {
        this.children.forEach((child) => {
            iter(child);

            child.traverse(iter);
        });
    }

    buildScene(loaders) {
        this.object = this.buildObject(loaders);
        this.children.forEach((child) => {
            child.buildScene(loaders);

            this.object.add(child.object);
        });
    }

    destroyScene() {
        this.children.forEach((child) => {
            child.destroyScene();

            this.object.remove(child.object);
        });
    }

    buildObject() {
        let object;
        if (this.args.constructorProps) {
            object = new this.type(...this.args.constructorProps);
        } else {
            object = new this.type();
        }

        if (this.props) {
            this.updateObject(object, this.props);
        }

        return object;
    }

    updateObject(object, props = {}) {
        Object.entries(props).forEach(([key, value]) => {
            this.updateObjectSingle(object, key, value);
        });
    }

    updateObjectSingle(object, prop, value) {
        switch (prop) {
            case 'position':
            case 'rotation':
                object[prop].set(value.x, value.y, value.z);
                break;
        }
    }

    @action
    updateArg(prop, value) {
        if (!this.object) {
            return;
        }

        this.updateObjectSingle(this.object, prop, value);
    }
}
