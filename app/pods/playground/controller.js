import Controller from '@ember/controller';

export default class extends Controller {
    sceneEditorValue = `
const geo = new THREE.BoxGeometry(1,1,1);
const mat = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource
});

const cube = new THREE.Mesh(geo, mat);
scene.add(cube);
`;
    vertexEditorValue = `void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    fragmentEditorValue = `void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
}
