import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32), // creates a sphere with radius 1 with 32 segments horizontally and vertically
    new THREE.ShaderMaterial({
        uniforms: {
            color: {
                value: new THREE.Color(0xffff00),
            },
        },
        vertexShader: vertexShaderSource, // vertexShaderSource is the content of the vertex shader editor
        fragmentShader: fragmentShaderSource, // fragmentShaderSource is the content of the fragment shader editor
    })
);

scene.add(sphere);
`;
    vertexEditorValue = `
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    fragmentEditorValue = `
uniform vec3 color;

void main() {
    gl_FragColor = vec4(color, 1.0);
}
`;
}
