import Person from "../../entities/Person/Person";
import Necessity from "../../entities/Person/Necessity";
import Todo from "../../entities/Commitment/ToDo";
import ToKeep from "../../entities/Commitment/ToKeep";
import Pillar from "../../entities/Relationship/Pillar";
import UpLove from "../../entities/UpLove/UpLove";

export interface RelationshipMetadata {
  name: string;
  createdAt: Date;
}

export interface IDatabase {
  // Initialization
  initialize(): Promise<void>;
  close(): Promise<void>;

  // Relationship Metadata operations
  initializeRelationshipMetadata(name: string): Promise<void>;
  getRelationshipMetadata(): Promise<RelationshipMetadata | null>;
  updateRelationshipMetadata(name: string): Promise<void>;

  // Person operations
  createPerson(name: string): Promise<Person>;
  getPerson(id: string): Promise<Person | null>;
  getAllPersons(): Promise<Person[]>;
  updatePerson(id: string, name: string): Promise<void>;
  deletePerson(id: string): Promise<void>;

  // Necessity operations
  createNecessity(
    personId: string,
    name: string,
    description: string
  ): Promise<Necessity>;
  getNecessity(id: string): Promise<Necessity | null>;
  getNecessitiesByPerson(personId: string): Promise<Necessity[]>;
  updateNecessity(id: string, name: string, description: string): Promise<void>;
  deleteNecessity(id: string): Promise<void>;

  // Todo operations
  createTodo(description: string, isDone: boolean): Promise<Todo>;
  getTodo(id: string): Promise<Todo | null>;
  getAllTodos(): Promise<Todo[]>;
  updateTodo(id: string, description: string, isDone: boolean): Promise<void>;
  deleteTodo(id: string): Promise<void>;

  // ToKeep operations
  createToKeep(description: string, isDone: boolean): Promise<ToKeep>;
  getToKeep(id: string): Promise<ToKeep | null>;
  getAllToKeeps(): Promise<ToKeep[]>;
  updateToKeep(id: string, description: string, isDone: boolean): Promise<void>;
  deleteToKeep(id: string): Promise<void>;

  // Pillar operations
  createPillar(
    name: string,
    priority: string,
    satisfaction: number
  ): Promise<Pillar>;
  getPillar(id: string): Promise<Pillar | null>;
  getAllPillars(): Promise<Pillar[]>;
  updatePillar(
    id: string,
    name: string,
    priority: string,
    satisfaction: number
  ): Promise<void>;
  deletePillar(id: string): Promise<void>;

  // UpLove operations
  createUpLove(
    date: Date,
    pillarIds: string[],
    toImprove: string[],
    toPraise: string[]
  ): Promise<UpLove>;
  getUpLove(id: string): Promise<UpLove | null>;
  getAllUpLoves(): Promise<UpLove[]>;
  updateUpLove(
    id: string,
    pillarIds: string[],
    toImprove: string[],
    toPraise: string[]
  ): Promise<void>;
  deleteUpLove(id: string): Promise<void>;
}
