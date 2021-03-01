import { helper } from '@ember/component/helper';

export default helper(function toNumber(params/*, hash*/) {
  return Number(params[0]);
});
