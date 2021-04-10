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
varying vec4 vColor;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 vPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vec3 vNormal = normalMatrix * normal;

    vec3 lightPos = (viewMatrix * vec4(1.0, 1.0, 1.0, 1.0)).xyz;
    float attenuation = 1.0 / pow(length(lightPos - vPos), 2.0);
    vec3 lightDir = normalize(lightPos - vPos);
    vec3 lightDirView = (viewMatrix * normalize(vec4(lightDir, 0.0))).xyz;

    vColor = vec4(1.0, 1.0, 0.0, 1.0) * max(dot(lightDirView, vNormal), 0.0);
}
`;

    fragmentEditorValue = `
varying vec4 vColor;

void main() {
    gl_FragColor = vColor;
}
`;
}
