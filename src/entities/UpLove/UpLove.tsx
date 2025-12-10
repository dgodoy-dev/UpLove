import Pillar from "../Relationship/Pillar";

export default class UpLove {
  private _id: string;
  private _date: Date;
  private _pillars: readonly Pillar[];
  private _toImprove: readonly string[];
  private _toPraise: readonly string[];

  constructor(
    id: string,
    date: Date = new Date(),
    pillars: readonly Pillar[] = [],
    toImprove: readonly string[] = [],
    toPraise: readonly string[] = []
  ) {
    this._id = id;
    this._date = date;

    this._pillars = pillars;
    this._toImprove = toImprove;
    this._toPraise = toPraise;
  }

  // ----- ID -----
  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  // ----- DATE -----
  public get date(): Date {
    return this._date;
  }

  public set date(value: Date) {
    this._date = value;
  }

  // ----- PILLARS -----
  public get pillars(): readonly Pillar[] {
    return this._pillars;
  }

  public set pillars(value: readonly Pillar[]) {
    this._pillars = value;
  }

  // ----- TO IMPROVE -----
  public get toImprove(): readonly string[] {
    return this._toImprove;
  }

  public set toImprove(value: readonly string[]) {
    this._toImprove = value;
  }

  // ----- TO PRAISE -----
  public get toPraise(): readonly string[] {
    return this._toPraise;
  }

  public set toPraise(value: readonly string[]) {
    this._toPraise = value;
  }
}
