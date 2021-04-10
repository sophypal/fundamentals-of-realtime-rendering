import Component from '@glimmer/component';
import { action } from '@ember/object';
import THREE, { Float32BufferAttribute, WireframeGeometry } from 'three';
import { tracked } from '@glimmer/tracking';

class FrustumGeometry extends THREE.BufferGeometry {
    constructor(camera) {
        super();

        const indices = [];
        const vertices = [];
        const normals = [];

        const f = this.getFrustumRects(camera);
        const planes = this.getFrustumPlanes(camera);

        this.type = 'FrustumGeometry';

        // near plane
        vertices.push(-f.near.h, f.near.v, -camera.near); // near top-left
        vertices.push(-f.near.h, -f.near.v, -camera.near); // near bottom-left
        vertices.push(f.near.h, -f.near.v, -camera.near); // near bottom-right
        vertices.push(f.near.h, f.near.v, -camera.near); // near top-right

        normals.push(...planes.near.normal.toArray());
        normals.push(...planes.near.normal.toArray());
        normals.push(...planes.near.normal.toArray());
        normals.push(...planes.near.normal.toArray());

        indices.push(0, 1, 2, 0, 2, 3);

        // far plane
        vertices.push(f.far.h, f.far.v, -camera.far); // far top-right
        vertices.push(f.far.h, -f.far.v, -camera.far); // far bottom-right
        vertices.push(-f.far.h, -f.far.v, -camera.far); // far bottom-left
        vertices.push(-f.far.h, f.far.v, -camera.far); // far top-left

        normals.push(...planes.far.normal.toArray());
        normals.push(...planes.far.normal.toArray());
        normals.push(...planes.far.normal.toArray());
        normals.push(...planes.far.normal.toArray());

        indices.push(4, 5, 6, 4, 6, 7);

        // right plane

        vertices.push(f.near.h, f.near.v, -camera.near); // near top-right
        vertices.push(f.near.h, -f.near.v, -camera.near); // near bottom-right
        vertices.push(f.far.h, -f.far.v, -camera.far); // far bottom-right
        vertices.push(f.far.h, f.far.v, -camera.far); // far top-right

        normals.push(...planes.right.normal.toArray());
        normals.push(...planes.right.normal.toArray());
        normals.push(...planes.right.normal.toArray());
        normals.push(...planes.right.normal.toArray());

        indices.push(8, 9, 10, 8, 10, 11);

        // left
        vertices.push(-f.far.h, f.far.v, -camera.far); // far top-left
        vertices.push(-f.far.h, -f.far.v, -camera.far); // far bottom-left
        vertices.push(-f.near.h, -f.near.v, -camera.near); // near bottom-left
        vertices.push(-f.near.h, f.near.v, -camera.near); // near top-left

        normals.push(...planes.left.normal.toArray());
        normals.push(...planes.left.normal.toArray());
        normals.push(...planes.left.normal.toArray());
        normals.push(...planes.left.normal.toArray());

        indices.push(12, 13, 14, 12, 14, 15);

        // bottom

        vertices.push(-f.near.h, -f.near.v, -camera.near); // near bottom-left
        vertices.push(f.near.h, -f.near.v, -camera.near); // near bottom-right
        vertices.push(f.far.h, -f.far.v, -camera.far); // far bottom-right
        vertices.push(-f.far.h, -f.far.v, -camera.far); // far bottom-left

        normals.push(...planes.bottom.normal.toArray());
        normals.push(...planes.bottom.normal.toArray());
        normals.push(...planes.bottom.normal.toArray());
        normals.push(...planes.bottom.normal.toArray());

        indices.push(16, 17, 18, 16, 18, 19);

        // top

        vertices.push(-f.near.h, f.near.v, -camera.near); // near top-left
        vertices.push(f.near.h, f.near.v, -camera.near); // near top-right
        vertices.push(f.far.h, f.far.v, -camera.far); // far top-right
        vertices.push(-f.far.h, f.far.v, -camera.far); // far top-left

        normals.push(...planes.top.normal.toArray());
        normals.push(...planes.top.normal.toArray());
        normals.push(...planes.top.normal.toArray());
        normals.push(...planes.top.normal.toArray());

        indices.push(20, 21, 22, 20, 22, 23);

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
    }

    getFrustumRects(camera) {
        const tan = Math.tan(THREE.MathUtils.degToRad(0.5 * camera.fov));
        const nearTop = camera.near * tan;
        const nearHeight = nearTop * 2;
        const nearWidth = camera.aspect * nearHeight;

        const farTop = camera.far * tan;
        const farHeight = farTop * 2;
        const farWidth = camera.aspect * farHeight;

        return {
            near: {
                h: nearWidth / 2,
                v: nearHeight / 2,
            },
            far: {
                h: farWidth / 2,
                v: farHeight / 2,
            },
        };
    }

    getFrustumPlanes(camera) {
        const frustum = new THREE.Frustum().setFromProjectionMatrix(
            camera.projectionMatrix
        );

        frustum.planes.forEach((plane) => {
            plane.normal.multiplyScalar(-1);
        });

        return {
            right: frustum.planes[0],
            left: frustum.planes[1],
            bottom: frustum.planes[2],
            top: frustum.planes[3],
            far: frustum.planes[4],
            near: frustum.planes[5],
        };
    }
}

class ProjectionLines extends THREE.BufferGeometry {
    constructor (object) {
        super();

        const vertices = [];
        const position = object.geometry.getAttribute('position');

        for (let i = 0; i < position.count; i += 3) {
            const transformed = new THREE.Vector3().fromBufferAttribute(position, i);
            transformed.applyMatrix4(object.matrixWorld);
            vertices.push(...transformed.toArray());
            vertices.push(0, 0, 0);
        }

        this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    }
}

export default class extends Component {
    object = new THREE.Group();
    cameraDef = {
        nearPlane: {
            min: 0.1,
            max: 10,
            default: 1,
        },
        farPlane: {
            min: 10,
            max: 100,
            default: 100,
        },
        fov: {
            min: 45,
            max: 100,
            default: 70,
        },
        aspect: {
            min: 0.5,
            max: 2,
            default: 1,
        },
    };

    sceneDef = {
        x: {
            min: -20,
            max: 20,
            default: 0,
        },
        y: {
            min: -20,
            max: 20,
            default: 0,
        },
        z: {
            min: -20,
            max: 20,
            default: -5,
        },
    };

    controlDef = {};

    constructor() {
        super(...arguments);

        if (this.args.props.enableCameraControls) {
            this.controlDef['Projection'] = this.cameraDef;
        }

        if (this.args.props.enableObjectControls) {
            this.controlDef['Object'] = this.sceneDef;
        }
    }

    updateFrustum(camera) {
        this.object.geometry.dispose();
        this.object.geometry = new FrustumGeometry(camera);

        const frustum = new THREE.Frustum().setFromProjectionMatrix(camera.projectionMatrix);

        if (frustum.intersectsObject(this.sceneObject)) {
            this.lines.visible = true;
        } else {
            this.lines.visible = false;
        }
    }

    updateScene() {
        this.sceneObject.updateMatrixWorld();

        this.lines.geometry.dispose();
        this.lines.geometry = new ProjectionLines(this.sceneObject);
    }

    @action
    onSceneInsert(scene) {
        this.camera = new THREE.PerspectiveCamera(70, 1, 1, 100);

        this.object = new THREE.Mesh(
            new FrustumGeometry(this.camera),
            new THREE.MeshPhongMaterial({
                color: 0x00ff88,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5,
                depthWrite: false,
            })
        );
        this.object.renderOrder = 3;

        this.sceneGroup = new THREE.Group();

        this.sceneObject = new THREE.Mesh(
            new THREE.BoxBufferGeometry(2, 2, 2),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.5,
            })
        );

        this.sceneObject.position.z = -5;
        this.sceneObject.renderOrder = 0;
        this.sceneObject.updateMatrixWorld();

        this.lines = new THREE.LineSegments(new ProjectionLines(this.sceneObject));
        this.wireframe = new THREE.LineSegments(
            this.sceneObject.geometry,
            new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5,
            })
        );
        this.wireframe.position.z = -5;
        this.wireframe.renderOrder = 1;

        this.sceneGroup.add(this.sceneObject);
        this.sceneGroup.add(this.lines);
        this.sceneGroup.add(this.wireframe);

        scene.add(this.object);

        if (this.args.props.enableObjectControls) {
            scene.add(this.sceneGroup);
        }
    }

    @action
    onControlChanged(prop, value) {
        prop = prop.replace('Projection.', '').replace('Object.', '');

        switch (prop) {
            case 'nearPlane':
                this.camera.near = value;
                break;
            case 'farPlane':
                this.camera.far = value;
                break;
            case 'fov':
                this.camera.fov = value;
                break;
            case 'aspect':
                this.camera.aspect = value;
                break;
            case 'x':
                this.sceneObject.position.x = value;
                this.wireframe.position.x = value;
                break;
            case 'y':
                this.sceneObject.position.y = value;
                this.wireframe.position.y = value;
                break;
            case 'z':
                this.sceneObject.position.z = value;
                this.wireframe.position.z = value;
                break;
        }

        this.camera.updateProjectionMatrix();
        this.updateFrustum(this.camera);
        this.updateScene();
    }
}
