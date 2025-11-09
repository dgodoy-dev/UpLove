export default class Necessity {
  private _id: string;
  private _name: string;
  private _description: string;

  constructor(id: string, name: string, description: string) {
    this._id = id;
    this._name = name;
    this._description = description;
  }
}
