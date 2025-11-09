import Necessity from "./Necessity";

export default class Person {
  private _id: string;
  private _name: string;
  private _necessities: ReadonlyArray<Necessity>;

  constructor(id: string, name: string, necessities: ReadonlyArray<Necessity>) {
    this._id = id;
    this._name = name;
    this._necessities = necessities;
  }
}
