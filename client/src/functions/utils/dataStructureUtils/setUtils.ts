// 和集合 (Union)
export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

// 積集合 (Intersection)
export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => setB.has(item)));
}

// 差集合 (Difference)
export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => !setB.has(item)));
}

// 対称差 (Symmetric Difference)
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...difference(setA, setB), ...difference(setB, setA)]);
}

// 部分集合 (Subset)
export function isSubset<T>(setA: Set<T>, setB: Set<T>): boolean {
  return [...setA].every(item => setB.has(item));
}

// 上位集合 (Superset)
export function isSuperset<T>(setA: Set<T>, setB: Set<T>): boolean {
  return [...setB].every(item => setA.has(item));
}

// オブジェクトの集合演算 (オブジェクトの比較には参照が使われる)
export function unionObjects<T extends object>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

export function intersectionObjects<T extends object>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => setB.has(item)));
}

export function differenceObjects<T extends object>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => !setB.has(item)));
}