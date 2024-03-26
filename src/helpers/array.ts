export function arraysHaveSameElements(
  arr1: Array<any>,
  arr2: Array<any>,
): boolean {
  return (
    arr1.length === arr2.length &&
    arr1.every((element) => arr2.includes(element))
  );
}
