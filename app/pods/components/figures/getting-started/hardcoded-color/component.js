import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32), // creates a sphere with radius 1 with 32 segments horizontally and vertically
    new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource, // vertexShaderSource is the content of the vertex shader editor
        fragmentShader: fragmentShaderSource, // fragmentShaderSource is the content of the fragment shader editor
    })
);

scene.add(sphere);
`;
    vertexEditorValue = `
// uniform mat4 projectionMatrix; // provided by ShaderMaterial
// uniform mat4 modelViewMatrix; // provided by ShaderMaterial
// attribute vec3 position; // provided by SphereBufferGeometry

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    fragmentEditorValue = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // color is a vec4 because of alpha
}
`;
}
