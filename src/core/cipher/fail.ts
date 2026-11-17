export class Fail extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'Fail';
  }
}
