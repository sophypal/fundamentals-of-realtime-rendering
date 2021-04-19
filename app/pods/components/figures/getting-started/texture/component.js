import Component from '@glimmer/component';
import config from 'fundamentals/config/environment';

export default class extends Component {
    sceneEditorValue = `
const loader = new THREE.TextureLoader();

loader.load('${config.rootURL}textures/castle_wall.jpg', function (texture) {
    const sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1, 32, 32), // creates a sphere with radius 1 with 32 segments horizontally and vertically
        new THREE.ShaderMaterial({
            /// new code block ///
            uniforms: {
                map: {
                    value: texture,
                },
            },
            //////////////////////
            vertexShader: vertexShaderSource, // vertexShaderSource is the content of the vertex shader editor
            fragmentShader: fragmentShaderSource, // fragmentShaderSource is the content of the fragment shader editor
        })
    );

    scene.add(sphere);
});
`;
    vertexEditorValue = `
varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}
`;

    fragmentEditorValue = `
varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D map;

void main() {
    gl_FragColor = texture(map, vUv);
}
`;
}
