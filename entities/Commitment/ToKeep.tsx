import Commitment from "./Commitment";

export default class ToKeep extends Commitment {
  constructor(
    public _id: string,
    public _description: string,
    public _isDone: boolean
  ) {
    super();
  }

  // TODO: additional functionality different from Todo can be added here
}
