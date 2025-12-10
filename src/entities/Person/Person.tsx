import Necessity from "./Necessity";

export default class Person {
  private _id: string;
  private _name: string;
  private _necessities: readonly Necessity[];

  constructor(id: string, name: string, necessities: Necessity[]) {
    this._id = id;
    this._name = name;
    this._necessities = necessities;
  }

  /**
   * Getter id
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter necessities
   * @return {readonly Necessity[]}
   */
  public get necessities(): readonly Necessity[] {
    return this._necessities;
  }

  /**
   * Setter id
   * @param {string} value
   */
  public set id(value: string) {
    this._id = value;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter necessities
   * @param {readonly Necessity[]} value
   */
  public set necessities(value: readonly Necessity[]) {
    this._necessities = value;
  }
}
