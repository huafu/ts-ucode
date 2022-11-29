export const print = (...items: any[]) => {
  process.stdout.write(items.map((item) => `${item}`).join(''));
};
export const println = (...items: any[]) => print(...items, '\n');
