import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
class Triangle extends THREE.BufferGeometry {
    constructor() {
        super();

        // defines the vertices for the triangle as 3 3D points
        const vertices = [
            -0.5, 0.0, 0.5, // point A
            0.5, 0.0, 0.5, // point B
            0.0, 0.0, -0.5 // point C
        ];
        const indices = [0, 1, 2]; // used to tell WebGL how to draw this triangle by teling it which vertex to use and in what order

        // this will setup a buffer to pass onto the GPU which will be used as inputs into a program that draws the triangle on the GPU
        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        // each vertex gets a normal
        // for this triangle, all the normals point in the same direction
        this.setAttribute('normal', new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
        this.setIndex(indices);
    }
}

const group = new THREE.Group();
group.position.y = 0.5; // this moves our triangle and it's normal vector representation up by 0.5 units

const triangle = new THREE.Mesh(
    new Triangle(),
    new THREE.MeshPhongMaterial({
        color: 0x156289,
        side: THREE.DoubleSide,
    })
);

// this is only a helper class, normals were defined in the Triangle BufferGeometry
const normal = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0));

group.add(triangle);
group.add(normal);

// finally adds this to the scene
scene.add(group);

// the default directional light points up
scene.add(new THREE.DirectionalLight());
`;
}
