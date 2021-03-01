import { helper } from '@ember/component/helper';
import THREE from 'three'

export default helper(function (params, hash) {
  const vec3 = new THREE.Vector3(params[0], params[1], params[2]);

  if (hash.normalize) {
    vec3.normalize()
  }

  return vec3
});
