import Score from "../types/Score";

export default abstract class UpLove {
  private _id: string;
  private _date: Date;
  private _mood: Score;
  private _stress: Score;

  constructor(_id: string, _date: Date, _mood: Score, _stress: Score) {
    this._id = _id;
    this._date = _date;
    this._mood = _mood;
    this._stress = _stress;
  }
}
