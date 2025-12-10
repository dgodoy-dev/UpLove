import * as SQLite from "expo-sqlite";
import uuid from "react-native-uuid";
import Todo from "../../entities/Commitment/ToDo";
import ToKeep from "../../entities/Commitment/ToKeep";
import Necessity from "../../entities/Person/Necessity";
import Person from "../../entities/Person/Person";
import Pillar from "../../entities/Relationship/Pillar";
import UpLove from "../../entities/UpLove/UpLove";
import Priority from "../../entities/types/Priority";
import { IDatabase, RelationshipMetadata } from "./IDatabase";
import { DataIntegrityError, NotFoundError } from "./errors";
import { DATABASE_NAME, SCHEMA_SQL } from "./schema";
import DatabaseValidator from "./DatabaseValidator";

export class DatabaseService implements IDatabase {
  protected db: SQLite.SQLiteDatabase | null = null;
  private _validator: DatabaseValidator;

  constructor(validator: DatabaseValidator) {
    this._validator = validator;
  }

  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    // Enable foreign key constraints (CRITICAL for data integrity)
    await this.db.execAsync("PRAGMA foreign_keys = ON;");

    // Security and performance settings
    await this.db.execAsync("PRAGMA journal_mode = WAL;"); // Better concurrency
    await this.db.execAsync("PRAGMA synchronous = FULL;"); // Data safety

    // Create schema
    await this.db.execAsync(SCHEMA_SQL);

    // Verify foreign key constraints are enabled
    const fkEnabled = await this.db.getFirstAsync<{ foreign_keys: number }>(
      "PRAGMA foreign_keys"
    );

    if (!fkEnabled || fkEnabled.foreign_keys !== 1) {
      throw new DataIntegrityError(
        "Foreign key constraints could not be enabled"
      );
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  private ensureInitialized(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  private generateId(): string {
    return uuid.v4() as string;
  }

  // ============================================
  // Relationship Metadata Operations
  // ============================================

  async initializeRelationshipMetadata(name: string): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);

    await db.runAsync(
      "INSERT OR REPLACE INTO relationship_metadata (id, name) VALUES (1, ?)",
      [sanitizedName]
    );
  }

  async getRelationshipMetadata(): Promise<RelationshipMetadata | null> {
    const db = this.ensureInitialized();

    const row = await db.getFirstAsync<{ name: string; created_at: number }>(
      "SELECT name, created_at FROM relationship_metadata WHERE id = 1"
    );

    if (!row) return null;

    return {
      name: row.name,
      createdAt: new Date(row.created_at * 1000),
    };
  }

  async updateRelationshipMetadata(name: string): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);

    // Verify metadata exists
    const metadata = await this.getRelationshipMetadata();
    if (!metadata) {
      throw new NotFoundError("RelationshipMetadata");
    }

    const result = await db.runAsync(
      "UPDATE relationship_metadata SET name = ? WHERE id = 1",
      [sanitizedName]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Update operation failed");
    }
  }

  // ============================================
  // Person Operations
  // ============================================

  async createPerson(name: string): Promise<Person> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);
    const id = this.generateId();

    await db.runAsync("INSERT INTO persons (id, name) VALUES (?, ?)", [
      id,
      sanitizedName,
    ]);

    return new Person(id, sanitizedName, []);
  }

  async getPerson(id: string): Promise<Person | null> {
    const db = this.ensureInitialized();

    const personRow = await db.getFirstAsync<{ id: string; name: string }>(
      "SELECT id, name FROM persons WHERE id = ?",
      [id]
    );

    if (!personRow) return null;

    const necessities = await this.getNecessitiesByPerson(id);
    return new Person(personRow.id, personRow.name, necessities);
  }

  async getAllPersons(): Promise<Person[]> {
    const db = this.ensureInitialized();

    const personRows = await db.getAllAsync<{ id: string; name: string }>(
      "SELECT id, name FROM persons LIMIT 10"
    );

    if (personRows.length === 0) return [];

    // Optimize: Get all necessities in one query
    const personIds = personRows.map((p) => p.id);
    const placeholders = personIds.map(() => "?").join(",");

    const necessityRows = await db.getAllAsync<{
      id: string;
      person_id: string;
      name: string;
      description: string;
    }>(
      `SELECT id, person_id, name, description FROM necessities WHERE person_id IN (${placeholders})`,
      personIds
    );

    // Group necessities by person_id
    const necessitiesByPerson = new Map<string, Necessity[]>();
    for (const row of necessityRows) {
      if (!necessitiesByPerson.has(row.person_id)) {
        necessitiesByPerson.set(row.person_id, []);
      }
      necessitiesByPerson
        .get(row.person_id)!
        .push(new Necessity(row.id, row.name, row.description));
    }

    return personRows.map(
      (row) =>
        new Person(row.id, row.name, necessitiesByPerson.get(row.id) || [])
    );
  }

  async updatePerson(id: string, name: string): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);

    // Verify person exists
    const person = await this.getPerson(id);
    if (!person) {
      throw new NotFoundError("Person");
    }

    const result = await db.runAsync(
      "UPDATE persons SET name = ? WHERE id = ?",
      [sanitizedName, id]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Update operation failed");
    }
  }

  async deletePerson(id: string): Promise<void> {
    const db = this.ensureInitialized();

    // Verify person exists
    const person = await this.getPerson(id);
    if (!person) {
      throw new NotFoundError("Person");
    }

    const result = await db.runAsync("DELETE FROM persons WHERE id = ?", [id]);

    if (result.changes === 0) {
      throw new DataIntegrityError("Delete operation failed");
    }
  }

  // ============================================
  // Necessity Operations
  // ============================================

  async createNecessity(
    personId: string,
    name: string,
    description: string
  ): Promise<Necessity> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);
    const sanitizedDescription = this._validator.validateString(
      description,
      "description",
      1,
      1000
    );

    // Verify person exists
    const person = await this.getPerson(personId);
    if (!person) {
      throw new NotFoundError("Person");
    }

    const id = this.generateId();

    await db.runAsync(
      "INSERT INTO necessities (id, person_id, name, description) VALUES (?, ?, ?, ?)",
      [id, personId, sanitizedName, sanitizedDescription]
    );

    return new Necessity(id, sanitizedName, sanitizedDescription);
  }

  async getNecessity(id: string): Promise<Necessity | null> {
    const db = this.ensureInitialized();

    const row = await db.getFirstAsync<{
      id: string;
      name: string;
      description: string;
    }>("SELECT id, name, description FROM necessities WHERE id = ?", [id]);

    if (!row) return null;
    return new Necessity(row.id, row.name, row.description);
  }

  async getNecessitiesByPerson(personId: string): Promise<Necessity[]> {
    const db = this.ensureInitialized();

    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      description: string;
    }>("SELECT id, name, description FROM necessities WHERE person_id = ?", [
      personId,
    ]);

    return rows.map((row) => new Necessity(row.id, row.name, row.description));
  }

  async updateNecessity(
    id: string,
    name: string,
    description: string
  ): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);
    const sanitizedDescription = this._validator.validateString(
      description,
      "description",
      1,
      1000
    );

    // Verify necessity exists
    const necessity = await this.getNecessity(id);
    if (!necessity) {
      throw new NotFoundError("Necessity");
    }

    const result = await db.runAsync(
      "UPDATE necessities SET name = ?, description = ? WHERE id = ?",
      [sanitizedName, sanitizedDescription, id]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Update operation failed");
    }
  }

  async deleteNecessity(id: string): Promise<void> {
    const db = this.ensureInitialized();

    // Verify necessity exists
    const necessity = await this.getNecessity(id);
    if (!necessity) {
      throw new NotFoundError("Necessity");
    }

    const result = await db.runAsync("DELETE FROM necessities WHERE id = ?", [
      id,
    ]);

    if (result.changes === 0) {
      throw new DataIntegrityError("Delete operation failed");
    }
  }

  // ============================================
  // Todo Operations
  // ============================================

  async createTodo(description: string, isDone: boolean): Promise<Todo> {
    const db = this.ensureInitialized();
    const sanitizedDescription = this._validator.validateString(
      description,
      "description",
      1,
      1000
    );
    const validIsDone = this._validator.validateBoolean(isDone, "isDone");
    const id = this.generateId();

    await db.runAsync(
      "INSERT INTO commitments (id, type, description, is_done) VALUES (?, ?, ?, ?)",
      [id, "todo", sanitizedDescription, validIsDone ? 1 : 0]
    );

    return new Todo(id, sanitizedDescription, validIsDone);
  }

  async getTodo(id: string): Promise<Todo | null> {
    const db = this.ensureInitialized();

    const row = await db.getFirstAsync<{
      id: string;
      description: string;
      is_done: number;
    }>(
      "SELECT id, description, is_done FROM commitments WHERE id = ? AND type = ?",
      [id, "todo"]
    );

    if (!row) return null;
    return new Todo(row.id, row.description, row.is_done === 1);
  }

  async getAllTodos(): Promise<Todo[]> {
    const db = this.ensureInitialized();

    const rows = await db.getAllAsync<{
      id: string;
      description: string;
      is_done: number;
    }>(
      "SELECT id, description, is_done FROM commitments WHERE type = ? LIMIT 1000",
      ["todo"]
    );

    return rows.map(
      (row) => new Todo(row.id, row.description, row.is_done === 1)
    );
  }

  async updateTodo(
    id: string,
    description: string,
    isDone: boolean
  ): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedDescription = this._validator.validateString(
      description,
      "description",
      1,
      1000
    );
    const validIsDone = this._validator.validateBoolean(isDone, "isDone");

    // Verify todo exists
    const todo = await this.getTodo(id);
    if (!todo) {
      throw new NotFoundError("Todo");
    }

    const result = await db.runAsync(
      "UPDATE commitments SET description = ?, is_done = ? WHERE id = ? AND type = ?",
      [sanitizedDescription, validIsDone ? 1 : 0, id, "todo"]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Update operation failed");
    }
  }

  async deleteTodo(id: string): Promise<void> {
    const db = this.ensureInitialized();

    // Verify todo exists
    const todo = await this.getTodo(id);
    if (!todo) {
      throw new NotFoundError("Todo");
    }

    const result = await db.runAsync(
      "DELETE FROM commitments WHERE id = ? AND type = ?",
      [id, "todo"]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Delete operation failed");
    }
  }

  // ============================================
  // ToKeep Operations
  // ============================================

  async createToKeep(description: string, isDone: boolean): Promise<ToKeep> {
    const db = this.ensureInitialized();
    const sanitizedDescription = this._validator.validateString(
      description,
      "description",
      1,
      1000
    );
    const validIsDone = this._validator.validateBoolean(isDone, "isDone");
    const id = this.generateId();

    await db.runAsync(
      "INSERT INTO commitments (id, type, description, is_done) VALUES (?, ?, ?, ?)",
      [id, "tokeep", sanitizedDescription, validIsDone ? 1 : 0]
    );

    return new ToKeep(id, sanitizedDescription, validIsDone);
  }

  async getToKeep(id: string): Promise<ToKeep | null> {
    const db = this.ensureInitialized();

    const row = await db.getFirstAsync<{
      id: string;
      description: string;
      is_done: number;
    }>(
      "SELECT id, description, is_done FROM commitments WHERE id = ? AND type = ?",
      [id, "tokeep"]
    );

    if (!row) return null;
    return new ToKeep(row.id, row.description, row.is_done === 1);
  }

  async getAllToKeeps(): Promise<ToKeep[]> {
    const db = this.ensureInitialized();

    const rows = await db.getAllAsync<{
      id: string;
      description: string;
      is_done: number;
    }>(
      "SELECT id, description, is_done FROM commitments WHERE type = ? LIMIT 1000",
      ["tokeep"]
    );

    return rows.map(
      (row) => new ToKeep(row.id, row.description, row.is_done === 1)
    );
  }

  async updateToKeep(
    id: string,
    description: string,
    isDone: boolean
  ): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedDescription = this._validator.validateString(
      description,
      "description",
      1,
      1000
    );
    const validIsDone = this._validator.validateBoolean(isDone, "isDone");

    // Verify tokeep exists
    const tokeep = await this.getToKeep(id);
    if (!tokeep) {
      throw new NotFoundError("ToKeep");
    }

    const result = await db.runAsync(
      "UPDATE commitments SET description = ?, is_done = ? WHERE id = ? AND type = ?",
      [sanitizedDescription, validIsDone ? 1 : 0, id, "tokeep"]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Update operation failed");
    }
  }

  async deleteToKeep(id: string): Promise<void> {
    const db = this.ensureInitialized();

    // Verify tokeep exists
    const tokeep = await this.getToKeep(id);
    if (!tokeep) {
      throw new NotFoundError("ToKeep");
    }

    const result = await db.runAsync(
      "DELETE FROM commitments WHERE id = ? AND type = ?",
      [id, "tokeep"]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Delete operation failed");
    }
  }

  // ============================================
  // Pillar Operations
  // ============================================

  async createPillar(
    name: string,
    priority: string,
    satisfaction: number
  ): Promise<Pillar> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);
    const validatedPriority = this._validator.validatePriority(priority);
    this._validator.validateSatisfaction(satisfaction);

    const id = this.generateId();

    await db.runAsync(
      "INSERT INTO pillars (id, name, priority, satisfaction) VALUES (?, ?, ?, ?)",
      [id, sanitizedName, validatedPriority, satisfaction]
    );

    return new Pillar(id, sanitizedName, validatedPriority, satisfaction);
  }

  async getPillar(id: string): Promise<Pillar | null> {
    const db = this.ensureInitialized();

    const row = await db.getFirstAsync<{
      id: string;
      name: string;
      priority: string;
      satisfaction: number;
    }>("SELECT id, name, priority, satisfaction FROM pillars WHERE id = ?", [
      id,
    ]);

    if (!row) return null;
    return new Pillar(
      row.id,
      row.name,
      row.priority as Priority,
      row.satisfaction
    );
  }

  async getAllPillars(): Promise<Pillar[]> {
    const db = this.ensureInitialized();

    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      priority: string;
      satisfaction: number;
    }>("SELECT id, name, priority, satisfaction FROM pillars LIMIT 1000");

    return rows.map(
      (row) =>
        new Pillar(row.id, row.name, row.priority as Priority, row.satisfaction)
    );
  }

  async updatePillar(
    id: string,
    name: string,
    priority: string,
    satisfaction: number
  ): Promise<void> {
    const db = this.ensureInitialized();
    const sanitizedName = this._validator.validateString(name, "name", 1, 255);
    const validatedPriority = this._validator.validatePriority(priority);
    this._validator.validateSatisfaction(satisfaction);

    // Verify pillar exists
    const pillar = await this.getPillar(id);
    if (!pillar) {
      throw new NotFoundError("Pillar");
    }

    const result = await db.runAsync(
      "UPDATE pillars SET name = ?, priority = ?, satisfaction = ? WHERE id = ?",
      [sanitizedName, validatedPriority, satisfaction, id]
    );

    if (result.changes === 0) {
      throw new DataIntegrityError("Update operation failed");
    }
  }

  async deletePillar(id: string): Promise<void> {
    const db = this.ensureInitialized();

    // Verify pillar exists
    const pillar = await this.getPillar(id);
    if (!pillar) {
      throw new NotFoundError("Pillar");
    }

    const result = await db.runAsync("DELETE FROM pillars WHERE id = ?", [id]);

    if (result.changes === 0) {
      throw new DataIntegrityError("Delete operation failed");
    }
  }

  // ============================================
  // UpLove Operations
  // ============================================

  async createUpLove(
    date: Date,
    pillarIds: string[],
    toImprove: string[],
    toPraise: string[]
  ): Promise<UpLove> {
    const db = this.ensureInitialized();
    this._validator.validateDate(date, "date", true);
    this._validator.validateArray(pillarIds, "pillarIds", 0, 10);
    const sanitizedToImprove = this._validator.validateStringArray(
      toImprove,
      "toImprove",
      0,
      50
    );
    const sanitizedToPraise = this._validator.validateStringArray(
      toPraise,
      "toPraise",
      0,
      50
    );

    // Validate all pillar IDs exist
    const pillars = await Promise.all(
      pillarIds.map(async (pillarId) => {
        const pillar = await this.getPillar(pillarId);
        if (!pillar) {
          throw new NotFoundError(`Pillar with id ${pillarId}`);
        }
        return pillar;
      })
    );

    const id = this.generateId();

    // Use transaction for atomic operation
    await db.withTransactionAsync(async () => {
      await db.runAsync("INSERT INTO up_loves (id, date) VALUES (?, ?)", [
        id,
        date.getTime(),
      ]);

      for (const pillarId of pillarIds) {
        await db.runAsync(
          "INSERT INTO up_love_pillars (up_love_id, pillar_id) VALUES (?, ?)",
          [id, pillarId]
        );
      }

      for (const item of sanitizedToImprove) {
        await db.runAsync(
          "INSERT INTO up_love_items (up_love_id, item_type, content) VALUES (?, ?, ?)",
          [id, "to_improve", item]
        );
      }

      for (const item of sanitizedToPraise) {
        await db.runAsync(
          "INSERT INTO up_love_items (up_love_id, item_type, content) VALUES (?, ?, ?)",
          [id, "to_praise", item]
        );
      }
    });

    return new UpLove(id, date, pillars, sanitizedToImprove, sanitizedToPraise);
  }

  async getUpLove(id: string): Promise<UpLove | null> {
    const db = this.ensureInitialized();

    const row = await db.getFirstAsync<{ id: string; date: number }>(
      "SELECT id, date FROM up_loves WHERE id = ?",
      [id]
    );

    if (!row) return null;

    const pillarRows = await db.getAllAsync<{ pillar_id: string }>(
      "SELECT pillar_id FROM up_love_pillars WHERE up_love_id = ?",
      [id]
    );

    const pillars = await Promise.all(
      pillarRows.map(async (row) => {
        const pillar = await this.getPillar(row.pillar_id);
        if (!pillar) {
          console.error(
            `Data integrity error: Pillar ${row.pillar_id} referenced but not found`
          );
          throw new DataIntegrityError("Data integrity error occurred");
        }
        return pillar;
      })
    );

    const toImproveRows = await db.getAllAsync<{ content: string }>(
      "SELECT content FROM up_love_items WHERE up_love_id = ? AND item_type = ?",
      [id, "to_improve"]
    );

    const toPraiseRows = await db.getAllAsync<{ content: string }>(
      "SELECT content FROM up_love_items WHERE up_love_id = ? AND item_type = ?",
      [id, "to_praise"]
    );

    return new UpLove(
      row.id,
      new Date(row.date),
      pillars,
      toImproveRows.map((r) => r.content),
      toPraiseRows.map((r) => r.content)
    );
  }

  async getAllUpLoves(): Promise<UpLove[]> {
    const db = this.ensureInitialized();

    const rows = await db.getAllAsync<{ id: string }>(
      "SELECT id FROM up_loves LIMIT 1000"
    );

    return Promise.all(
      rows.map(async (row) => {
        const upLove = await this.getUpLove(row.id);
        if (!upLove) {
          console.error(`Data integrity error: UpLove ${row.id} not found`);
          throw new DataIntegrityError("Data integrity error occurred");
        }
        return upLove;
      })
    );
  }

  async updateUpLove(
    id: string,
    pillarIds: string[],
    toImprove: string[],
    toPraise: string[]
  ): Promise<void> {
    const db = this.ensureInitialized();
    this._validator.validateArray(pillarIds, "pillarIds", 0, 10);
    const sanitizedToImprove = this._validator.validateStringArray(
      toImprove,
      "toImprove",
      0,
      50
    );
    const sanitizedToPraise = this._validator.validateStringArray(
      toPraise,
      "toPraise",
      0,
      50
    );

    // Verify uplove exists
    const upLove = await this.getUpLove(id);
    if (!upLove) {
      throw new NotFoundError("UpLove");
    }

    // Validate all pillar IDs exist
    await Promise.all(
      pillarIds.map(async (pillarId) => {
        const pillar = await this.getPillar(pillarId);
        if (!pillar) {
          throw new NotFoundError(`Pillar with id ${pillarId}`);
        }
      })
    );

    // Use transaction for atomic operation
    await db.withTransactionAsync(async () => {
      // Delete existing items and pillars
      await db.runAsync("DELETE FROM up_love_items WHERE up_love_id = ?", [
        id,
      ]);
      await db.runAsync("DELETE FROM up_love_pillars WHERE up_love_id = ?", [
        id,
      ]);

      // Insert new pillars
      for (const pillarId of pillarIds) {
        await db.runAsync(
          "INSERT INTO up_love_pillars (up_love_id, pillar_id) VALUES (?, ?)",
          [id, pillarId]
        );
      }

      // Insert new items
      for (const item of sanitizedToImprove) {
        await db.runAsync(
          "INSERT INTO up_love_items (up_love_id, item_type, content) VALUES (?, ?, ?)",
          [id, "to_improve", item]
        );
      }

      for (const item of sanitizedToPraise) {
        await db.runAsync(
          "INSERT INTO up_love_items (up_love_id, item_type, content) VALUES (?, ?, ?)",
          [id, "to_praise", item]
        );
      }
    });
  }

  async deleteUpLove(id: string): Promise<void> {
    const db = this.ensureInitialized();

    // Verify uplove exists
    const upLove = await this.getUpLove(id);
    if (!upLove) {
      throw new NotFoundError("UpLove");
    }

    const result = await db.runAsync("DELETE FROM up_loves WHERE id = ?", [
      id,
    ]);

    if (result.changes === 0) {
      throw new DataIntegrityError("Delete operation failed");
    }
  }
}
