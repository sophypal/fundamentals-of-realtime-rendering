import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE from 'three';

export default class extends Component {
    @action
    onSceneInsert(scene) {
        const group = new THREE.Group();

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2, 2, 1, 1),
            new THREE.MeshPhongMaterial({
                color: 0x156289,
                side: THREE.DoubleSide,
            })
        );
        plane.rotation.x = -Math.PI / 2;
        group.add(plane);

        if (this.args.props.enableWireframe) {
            const wireframe = new THREE.LineSegments(
                new THREE.WireframeGeometry(plane.geometry),
                new THREE.LineBasicMaterial()
            );
            wireframe.rotation.x = -Math.PI / 2;
            group.add(wireframe);
        }

        if (this.args.props.enableNormal) {
            const normal = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0));
            group.add(normal);
        }

        scene.add(group);
    }
}
