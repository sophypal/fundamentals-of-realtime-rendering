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
    // creates circles for all 3 channels
    // a unit circle is defined as all the points equally distant from a center point which is easy to calculate with length
    // pseudocode
    // 1. Create a vector from current point to center point, scale x by 2 because of the aspect ratio of this rectangle surface
    // 2. Take this length and use smoothstep to create a nice transition at the circle border. Everything below 0.3 gets 0.0 and
    //    everything above 0.3 gets 1.0. Everything between is smoothly transitioned.
    // 3. Take the inverse of this result so that 1.0 is inside and 0.0 is outside.
    float red = 1.0 - smoothstep(0.3, 0.31, length(vec2((vUV.s - 0.4) * 2.0, vUV.t - 0.6)));
    float green = 1.0 - smoothstep(0.3, 0.31, length(vec2((vUV.s - 0.6) * 2.0, vUV.t - 0.6)));
    float blue = 1.0 - smoothstep(0.3, 0.31, length(vec2((vUV.s - 0.5) * 2.0, vUV.t - 0.4)));

    //vec3 color = vec3(red, green, blue); // uncomment this and comment out the layer stack use of mix below to see what it does

    vec3 color = vec3(1.0, 1.0, 1.0); // first layer (white background)
    color = mix(color, vec3(1.0, 0.0, 0.0), red); // second layer
    color = mix(color, vec3(0.0, 1.0, 0.0), green); // third layer
    color = mix(color, vec3(0.0, 0.0, 1.0), blue); // fourth layer

    gl_FragColor = vec4(color, 1.0);
}
`;
}
