import Priority from "../types/Priority";
import Score from "../types/Score";

export default class Pillar {
  private _id: string;
  private _name: string;
  private _priority: Priority;
  private _satisfaction: Score;

  constructor(
    id: string,
    name: string,
    priority: Priority,
    satisfaction: Score
  ) {
    this._id = id;
    this._name = name;
    this._priority = priority;
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
   * @return {Score}
   */
  public get satisfaction(): Score {
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
   * @param {Score} value
   */
  public set satisfaction(value: Score) {
    this._satisfaction = value;
  }
}
