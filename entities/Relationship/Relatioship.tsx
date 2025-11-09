import Person from "../Person/Person";
import Pillar from "./Pillar";
import RelationshipEvent from "./RelationshipEvent";
import UpLove from "../UpLove/UpLove";

export default class Relationship {
  private _id: string;
  private _name: string;
  private _people: ReadonlyArray<Person>;
  private _pillars: ReadonlyArray<Pillar>;
  private _upLoves: ReadonlyArray<UpLove>;
  private _relationshipEvents: ReadonlyArray<RelationshipEvent>;

  constructor(
    id: string,
    name: string,
    people: ReadonlyArray<Person>,
    pillars: ReadonlyArray<Pillar>,
    upLoves: ReadonlyArray<UpLove>,
    relationshipEvents: ReadonlyArray<RelationshipEvent>
  ) {
    this._id = id;
    this._name = name;
    this._people = people;
    this._pillars = pillars;
    this._upLoves = upLoves;
    this._relationshipEvents = relationshipEvents;
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
   * @return {ReadonlyArray<Person>}
   */
  public get people(): ReadonlyArray<Person> {
    return this._people;
  }

  /**
   * Getter pillars
   * @return {ReadonlyArray<Pillar>}
   */
  public get pillars(): ReadonlyArray<Pillar> {
    return this._pillars;
  }

  /**
   * Getter upLoves
   * @return {ReadonlyArray<UpLove>}
   */
  public get upLoves(): ReadonlyArray<UpLove> {
    return this._upLoves;
  }

  /**
   * Getter relationshipEvents
   * @return {ReadonlyArray<RelationshipEvent>}
   */
  public get relationshipEvents(): ReadonlyArray<RelationshipEvent> {
    return this._relationshipEvents;
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
   * @param {ReadonlyArray<Person>} value
   */
  public set people(value: ReadonlyArray<Person>) {
    this._people = value;
  }

  /**
   * Setter pillars
   * @param {ReadonlyArray<Pillar>} value
   */
  public set pillars(value: ReadonlyArray<Pillar>) {
    this._pillars = value;
  }

  /**
   * Setter upLoves
   * @param {ReadonlyArray<UpLove>} value
   */
  public set upLoves(value: ReadonlyArray<UpLove>) {
    this._upLoves = value;
  }
}
