import omp from "omp_wrap";

export async function evaluate(params) {
  return await omp.evaluateHands(params);
}

export async function evaluateNoCb(params) {
  params.callback = null;
  return await omp.evaluateHands(params);
}

export function hash(str) {
  var hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}
export default { evaluate, evaluateNoCb, hash };
