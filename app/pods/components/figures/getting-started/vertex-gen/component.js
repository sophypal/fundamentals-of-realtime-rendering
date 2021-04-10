import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 32, 32),
    new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
    })
);

scene.add(sphere);
`;
    vertexEditorValue = `
varying vec3 outColor;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    outColor=vec3(uv.s, uv.t, 0.0); // uv is another vertex attribute which automatically gets declared by THREE.js and setup with SphereBufferGeometry
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
