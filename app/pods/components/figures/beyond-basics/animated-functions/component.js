import Component from '@glimmer/component';

export default class extends Component {
    sceneEditorValue = `
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: {
            value: 0,
        },
    },
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource,
})
const sphere = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 1),
    material
);

animate(function (t) {
    material.uniforms.uTime.value = t/1000;
})

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
uniform float uTime;

void main()
{
    float y = (sin(vUV.x*7.0*PI+uTime) + 1.0)/2.0;
    //float y = step(0.5, vUV.x);

    vec3 color = vec3(y);
    gl_FragColor = vec4(color, 1.0);
}
`;
}
