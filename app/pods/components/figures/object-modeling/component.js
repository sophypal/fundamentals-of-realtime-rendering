import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';
import config from 'fundamentals/config/environment';

export default class extends Component {
    @action
    onSceneInsert(scene, component) {
        const group = new THREE.Group();
        group.position.y = -5;
        group.rotation.y = -Math.PI / 2;

        component.loaders.gltf.load(config.rootURL + '/models/basictrex/basictrex.glb', (gltfObject) => {
            const object = gltfObject.scene;

            object.position.y = -5;

            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    switch (this.args.props.mode) {
                        case 'wireframe':
                            const wireframe = new THREE.LineSegments();
                            wireframe.material = new THREE.LineBasicMaterial();
                            wireframe.geometry = new THREE.WireframeGeometry(child.geometry);

                            group.add(wireframe);
                            break;
                        case 'vertex-colors':
                            child.material = new THREE.MeshBasicMaterial({
                                vertexColors: true,
                            });
                            break;
                        case 'normals':
                            child.material = new THREE.MeshLambertMaterial({
                                vertexColors: true,
                            });
                            break;
                    }
                }
            });

            scene.add(group);
            if (this.args.props.mode !== 'wireframe') {
                object.scale.set(.01, .01, .01);
                object.rotation.y = -Math.PI/2;
                scene.add(object);
            }
        });
    }
}
