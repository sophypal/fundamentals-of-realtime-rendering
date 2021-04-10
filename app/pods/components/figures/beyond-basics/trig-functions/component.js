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
#define PI 3.1459265359

varying vec2 vUV;

void main()
{
    float y = (sin(vUV.x*PI*7.0)+1.0)/2.0; // map -1.0, 1.0 to 0.0, 1.0

    vec3 color = vec3(y);
    gl_FragColor = vec4(color, 1.0);
}
`;
}
