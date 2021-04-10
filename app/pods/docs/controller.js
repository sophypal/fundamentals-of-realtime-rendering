import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import EmberObject, { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class extends Controller {
    @service router;

    @tracked
    expanded = [];

    @tracked
    navigation = [
        EmberObject.create({
            label: 'Introduction',
            route: 'docs.introduction',
            icon: 'home',
        }),
        EmberObject.create({
            label: 'Playground',
            route: 'playground',
            icon: 'puzzle',
        }),
        EmberObject.create({
            label: 'Preliminary Theory',
            expanded: false,
            links: [
                {
                    label: 'Photography',
                    route: 'docs.photography',
                },
                {
                    label: 'Physics of Light',
                    route: 'docs.physics-of-light',
                },
                {
                    label: 'Language of 3D',
                    route: 'docs.language-of-3d',
                },
                {
                    label: 'Object Modeling',
                    route: 'docs.object-modeling',
                },
                {
                    label: 'Transformations',
                    route: 'docs.transformations',
                },
                {
                    label: 'Scene Graphs',
                    route: 'docs.scene-graphs',
                },
            ],
        }),
        EmberObject.create({
            label: 'Intro to Shaders',
            links: [
                {
                    label: 'Graphics Pipeline',
                    route: 'docs.graphics-pipeline',
                },
                {
                    label: 'The Theory',
                    route: 'docs.shader-theory',
                },
                {
                    label: 'Getting Started',
                    route: 'docs.shader-getting-started',
                },
                {
                    label: 'Beyond the Basics',
                    route: 'docs.shader-beyond-the-basics',
                },
            ],
        }),
        EmberObject.create({
            label: 'Resources',
            links: [
                {
                    label: 'Real-Time Rendering',
                    href: 'http://realtimerendering.com',
                    external: true,
                },
                {
                    label: 'Learn OpenGL',
                    href: 'http://learnopengl.com',
                    external: true,
                },
                {
                    label: 'WebGL Fundamentals',
                    href: 'http://webglfundamentals.org/',
                    external: true,
                },
                {
                    label: 'Three.js Fundamentals',
                    href: 'http://threejsfundamentals.org/',
                    external: true,
                },
                {
                    label: 'Three.js',
                    href: 'http://threejs.org',
                    external: true,
                },
                {
                    label: 'Book of Shaders',
                    href: 'http://thebookofshaders.com',
                    external: true,
                },
            ],
        }),
    ];

    get currentRoute() {
        return this.router.currentRoute.name;
    }

    @action
    onNavClicked(name) {
        const nav = this.navigation.find((nav) => nav.label === name);

        nav.toggleProperty('expanded');
    }
}
