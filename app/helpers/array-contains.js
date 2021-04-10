import { helper } from '@ember/component/helper';

export default helper(function arrayContains(params) {
  const array = params[0];
  const item = params[1];

  return array.includes(item);
});
