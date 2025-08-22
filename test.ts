// 请写出一个可以生成整型随机数数组（内部元素不重复）的函数，
// 并可以根据参数设置随机数生成的范围和数量。
// 例如：函数makeRandomList(a,b,c)，可以生成 [a,b）范围内，
// 长度为c的随机数数组。
function makeRandomList(a: number, b: number, c: number): number[] {
  const list: number[] = [];
  while (list.length < c) {
    const num = Math.floor(Math.random() * (b - a)) + a;
    if (!list.includes(num)) {
      list.push(num);
    }
  }
  return list;
}

