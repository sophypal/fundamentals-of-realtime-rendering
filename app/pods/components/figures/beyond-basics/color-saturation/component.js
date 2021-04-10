import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
const sphere = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 1),
    new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
    })
);

scene.add(sphere);
`;
    vertexEditorValue = `
varying vec2 vUV;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUV = uv;
}
`;

    fragmentEditorValue = `
    varying vec2 vUV;

    void main()
    {
        float brightness = 1.0;
        vec3 color = vec3(1, 1.0 - vUV.s, 1.0 - vUV.s) * brightness;
        gl_FragColor = vec4(color, 1.0);
    }
`;
}
