import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
const sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const colors = [];

for (let i = 0; i < sphereGeometry.getAttribute('position').count; ++i) {
    const color = [Math.random(255), Math.random(255), Math.random(255)];
    colors.push(color[0], color[1], color[2]);
}

sphereGeometry.setAttribute('color', new THREE.Float32Attribute(colors, 3));


const sphere = new THREE.Mesh(
    sphereGeometry,
    new THREE.ShaderMaterial({
        vertexColors: true, // enables vertex coloring so vColor is available to our shader
        vertexShader: vertexShaderSource, // vertexShaderSource is the content of the vertex shader editor
        fragmentShader: fragmentShaderSource, // fragmentShaderSource is the content of the fragment shader editor
    })
);

scene.add(sphere);
`;
    vertexEditorValue = `
varying vec3 outColor;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    outColor = color;
}
`;

    fragmentEditorValue = `
varying vec3 outColor;

void main()
{
    gl_FragColor = vec4(outColor, 1.0);
}
`;
}
