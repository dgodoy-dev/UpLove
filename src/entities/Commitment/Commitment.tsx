export default abstract class Commitment {
  abstract _id: string;
  abstract _description: string;
  abstract _isDone: boolean;

  public get id(): string {
    return this._id;
  }
  public get description(): string {
    return this._description;
  }
  public get isDone(): boolean {
    return this._isDone;
  }
  public set isDone(value: boolean) {
    this._isDone = value;
  }
  public set description(value: string) {
    this._description = value;
  }
}
