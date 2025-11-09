import Pillar from "../Relationship/Pillar";
import RelationshipEvent from "../Relationship/RelationshipEvent";
import { Score } from "../types/Score";
import UpLove from "./UpLove";

export default class WeeklyUpLove extends UpLove {
  private _pillars: ReadonlyArray<Pillar>;
  private _events: ReadonlyArray<RelationshipEvent>;

  constructor(
    id: string,
    mood: Score,
    stress: Score,
    pillars: ReadonlyArray<Pillar>,
    events: ReadonlyArray<RelationshipEvent>
    // todo: consider date
  ) {
    super(id, new Date(), mood, stress);
    this._pillars = pillars;
    this._events = events;
  }

  /**
   * Getter pillars
   * @return {ReadonlyArray<Pillar>}
   */
  public get pillars(): ReadonlyArray<Pillar> {
    return this._pillars;
  }

  /**
   * Getter events
   * @return {ReadonlyArray<RelationshipEvent>}
   */
  public get events(): ReadonlyArray<RelationshipEvent> {
    return this._events;
  }

  /**
   * Setter pillars
   * @param {ReadonlyArray<Pillar>} value
   */
  public set pillars(value: ReadonlyArray<Pillar>) {
    this._pillars = value;
  }

  /**
   * Setter events
   * @param {ReadonlyArray<RelationshipEvent>} value
   */
  public set events(value: ReadonlyArray<RelationshipEvent>) {
    this._events = value;
  }
}
