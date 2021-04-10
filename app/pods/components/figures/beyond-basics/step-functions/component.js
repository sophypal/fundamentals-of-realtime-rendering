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
    float y = smoothstep(0.0, 1.0, vUV.x);
    //float y = step(0.5, vUV.x);

    vec3 color = vec3(y);
    gl_FragColor = vec4(color, 1.0);
}
`;
}
