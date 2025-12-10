import Person from "../Person/Person";
import Pillar from "./Pillar";
import UpLove from "../UpLove/UpLove";

export default class Relationship {
  private _id: string;
  private _name: string;
  private _people: readonly Person[];
  private _pillars: readonly Pillar[];
  private _upLoves: readonly UpLove[];

  constructor(
    id: string,
    name: string,
    people: Person[],
    pillars: Pillar[],
    upLoves: UpLove[]
  ) {
    this._id = id;
    this._name = name;
    this._people = people;
    this._pillars = pillars;
    this._upLoves = upLoves;
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
   * Getter people
   * @return {readonly Person[]}
   */
  public get people(): readonly Person[] {
    return this._people;
  }

  /**
   * Getter pillars
   * @return {readonly Pillar[]}
   */
  public get pillars(): readonly Pillar[] {
    return this._pillars;
  }

  /**
   * Getter upLoves
   * @return {readonly UpLove[]}
   */
  public get upLoves(): readonly UpLove[] {
    return this._upLoves;
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
   * Setter people
   * @param {readonly Person[]} value
   */
  public set people(value: readonly Person[]) {
    this._people = value;
  }

  /**
   * Setter pillars
   * @param {readonly Pillar[]} value
   */
  public set pillars(value: readonly Pillar[]) {
    this._pillars = value;
  }

  /**
   * Setter upLoves
   * @param {readonly UpLove[]} value
   */
  public set upLoves(value: readonly UpLove[]) {
    this._upLoves = value;
  }
}
