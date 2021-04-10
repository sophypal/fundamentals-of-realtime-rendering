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
    float y = 1.0;
    //float y = pow(vUV.x - 0.5, 2.0); // subtract 0.5 to center
    //float y = vUV.x;
    //float y = abs(vUV.x - 0.5);
    //float y = mod(vUV.x, 0.5); // often used to repeat

    vec3 color = vec3(y);
    gl_FragColor = vec4(color, 1.0);
}
`;
}
