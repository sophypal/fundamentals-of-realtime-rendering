import EmberRouter from '@ember/routing/router';
import config from 'fundamentals/config/environment';

export default class Router extends EmberRouter {
    location = config.locationType;
    rootURL = config.rootURL;
}

Router.map(function () {
    this.route('playground');
    this.route('docs', function () {
        this.route('introduction');
        this.route('photography');
        this.route('physics-of-light');
        this.route('language-of-3d');
        this.route('object-modeling');
        this.route('transformations');
        this.route('scene-graphs');
        this.route('graphics-pipeline');
        this.route('shader-theory');
        this.route('shader-getting-started');
        this.route('shader-beyond-the-basics');
    });
});
