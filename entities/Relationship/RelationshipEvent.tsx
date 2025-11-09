import EventSentiment from "../types/EventSentiment";

export default class Event {
  private _id: string;
  private _name: string;
  private _description: string;
  private _date: Date;
  private _sentiment: EventSentiment;

  constructor(
    id: string,
    name: string,
    description: string,
    date: Date,
    sentiment: EventSentiment
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._date = date;
    this._sentiment = sentiment;
  }
}
