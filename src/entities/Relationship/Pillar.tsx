import Priority from "../types/Priority";

export default class Pillar {
  private _id: string;
  private _name: string;
  private _priority: Priority;
  private _satisfaction: number;

  constructor(
    id: string,
    name: string,
    priority: Priority,
    satisfaction: number
  ) {
    this._id = id;
    this._name = name;
    this._priority = priority;

    if (satisfaction < 1 || satisfaction > 10) {
      throw new Error("A Pillar cannot have a score outside range [1-10]");
    }
    this._satisfaction = satisfaction;
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
   * Getter priority
   * @return {Priority}
   */
  public get priority(): Priority {
    return this._priority;
  }

  /**
   * Getter satisfaction
   * @return {number}
   */
  public get satisfaction(): number {
    return this._satisfaction;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter priority
   * @param {Priority} value
   */
  public set priority(value: Priority) {
    this._priority = value;
  }

  /**
   * Setter satisfaction
   * @param {number} value
   */
  public set satisfaction(value: number) {
    if (value <= 0 && value >= 10) {
      throw new Error("A Pillar cannot have a score outside range [1-10]");
    }
    this._satisfaction = value;
  }
}
