import { DatabaseService } from "./DatabaseService";
import DatabaseValidator from "./DatabaseValidator";
import { NotFoundError, ValidationError, DataIntegrityError } from "./errors";
import * as SQLite from "expo-sqlite";

// Mock expo-sqlite
jest.mock("expo-sqlite");

// Mock uuid
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "mock-uuid-" + Math.random().toString(36).substring(7)),
}));

describe("DatabaseService", () => {
  let dbService: DatabaseService;
  let mockDb: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock database
    mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn().mockResolvedValue([]),
      closeAsync: jest.fn().mockResolvedValue(undefined),
      withTransactionAsync: jest.fn(async (callback) => await callback()),
    };

    // Mock SQLite.openDatabaseAsync
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);

    dbService = new DatabaseService(new DatabaseValidator());
  });

  afterEach(async () => {
    await dbService.close();
  });

  describe("Initialization", () => {
    it("should initialize database successfully", async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });

      await dbService.initialize();

      expect(SQLite.openDatabaseAsync).toHaveBeenCalledWith("uplove.db");
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        "PRAGMA foreign_keys = ON;"
      );
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        "PRAGMA journal_mode = WAL;"
      );
      expect(mockDb.execAsync).toHaveBeenCalledWith(
        "PRAGMA synchronous = FULL;"
      );
      expect(mockDb.getFirstAsync).toHaveBeenCalledWith("PRAGMA foreign_keys");
    });

    it("should throw error if foreign keys cannot be enabled", async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 0 });

      await expect(dbService.initialize()).rejects.toThrow(DataIntegrityError);
      await expect(dbService.initialize()).rejects.toThrow(
        "Foreign key constraints could not be enabled"
      );
    });

    it("should close database successfully", async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();

      await dbService.close();

      expect(mockDb.closeAsync).toHaveBeenCalled();
    });

    it("should throw error when calling methods without initialization", async () => {
      await expect(dbService.createPerson("John")).rejects.toThrow(
        "Database not initialized"
      );
    });
  });

  describe("Relationship Metadata Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("initializeRelationshipMetadata", () => {
      it("should initialize relationship metadata successfully", async () => {
        await dbService.initializeRelationshipMetadata("Our Relationship");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT OR REPLACE INTO relationship_metadata (id, name) VALUES (1, ?)",
          ["Our Relationship"]
        );
      });

      it("should validate name", async () => {
        await expect(
          dbService.initializeRelationshipMetadata("")
        ).rejects.toThrow(ValidationError);
      });
    });

    describe("getRelationshipMetadata", () => {
      it("should get relationship metadata successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          name: "Our Relationship",
          created_at: 1640000000,
        });

        const metadata = await dbService.getRelationshipMetadata();

        expect(metadata).not.toBeNull();
        expect(metadata?.name).toBe("Our Relationship");
        expect(metadata?.createdAt).toBeInstanceOf(Date);
      });

      it("should return null when no metadata exists", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        const metadata = await dbService.getRelationshipMetadata();

        expect(metadata).toBeNull();
      });
    });

    describe("updateRelationshipMetadata", () => {
      it("should update relationship metadata successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          name: "Old Name",
          created_at: 1640000000,
        });

        await dbService.updateRelationshipMetadata("New Name");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "UPDATE relationship_metadata SET name = ? WHERE id = 1",
          ["New Name"]
        );
      });

      it("should throw NotFoundError if metadata does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.updateRelationshipMetadata("Name")
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("Person Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("createPerson", () => {
      it("should create a person successfully", async () => {
        const person = await dbService.createPerson("John Doe");

        expect(person.name).toBe("John Doe");
        expect(person.id).toBeDefined();
        expect(person.necessities).toEqual([]);
        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT INTO persons (id, name) VALUES (?, ?)",
          [expect.any(String), "John Doe"]
        );
      });

      it("should trim whitespace from name", async () => {
        const person = await dbService.createPerson("  John Doe  ");

        expect(person.name).toBe("John Doe");
      });

      it("should reject empty name", async () => {
        await expect(dbService.createPerson("")).rejects.toThrow(
          ValidationError
        );
        await expect(dbService.createPerson("")).rejects.toThrow(
          "name must be at least 1 characters"
        );
      });

      it("should reject whitespace-only name", async () => {
        await expect(dbService.createPerson("   ")).rejects.toThrow(
          ValidationError
        );
      });

      it("should reject name exceeding 255 characters", async () => {
        const longName = "a".repeat(256);
        await expect(dbService.createPerson(longName)).rejects.toThrow(
          ValidationError
        );
        await expect(dbService.createPerson(longName)).rejects.toThrow(
          "name must not exceed 255 characters"
        );
      });

      it("should reject name with control characters", async () => {
        await expect(dbService.createPerson("John\u0000Doe")).rejects.toThrow(
          ValidationError
        );
        await expect(dbService.createPerson("John\u0000Doe")).rejects.toThrow(
          "name contains invalid characters"
        );
      });

      it("should reject non-string name", async () => {
        await expect(dbService.createPerson(123 as any)).rejects.toThrow(
          ValidationError
        );
      });
    });

    describe("getPerson", () => {
      it("should get person by id successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const person = await dbService.getPerson("person-1");

        expect(person).not.toBeNull();
        expect(person?.id).toBe("person-1");
        expect(person?.name).toBe("John Doe");
        expect(person?.necessities).toEqual([]);
      });

      it("should return null for non-existent person", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        const person = await dbService.getPerson("non-existent");

        expect(person).toBeNull();
      });

      it("should include necessities when getting person", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([
          {
            id: "necessity-1",
            name: "Sleep",
            description: "8 hours of sleep",
          },
        ]);

        const person = await dbService.getPerson("person-1");

        expect(person?.necessities).toHaveLength(1);
        expect(person?.necessities[0].name).toBe("Sleep");
      });
    });

    describe("getAllPersons", () => {
      it("should get all persons successfully", async () => {
        mockDb.getAllAsync
          .mockResolvedValueOnce([
            { id: "person-1", name: "John Doe" },
            { id: "person-2", name: "Jane Smith" },
          ])
          .mockResolvedValueOnce([
            {
              id: "necessity-1",
              person_id: "person-1",
              name: "Sleep",
              description: "8 hours",
            },
          ]);

        const persons = await dbService.getAllPersons();

        expect(persons).toHaveLength(2);
        expect(persons[0].name).toBe("John Doe");
        expect(persons[1].name).toBe("Jane Smith");
      });

      it("should return empty array when no persons exist", async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const persons = await dbService.getAllPersons();

        expect(persons).toEqual([]);
      });
    });

    describe("updatePerson", () => {
      it("should update person successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        await dbService.updatePerson("person-1", "John Smith");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "UPDATE persons SET name = ? WHERE id = ?",
          ["John Smith", "person-1"]
        );
      });

      it("should throw NotFoundError if person does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.updatePerson("non-existent", "New Name")
        ).rejects.toThrow(NotFoundError);
      });

      it("should validate name before updating", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });

        await expect(dbService.updatePerson("person-1", "")).rejects.toThrow(
          ValidationError
        );
      });

      it("should throw DataIntegrityError if update fails", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);
        mockDb.runAsync.mockResolvedValueOnce({ changes: 0 });

        await expect(
          dbService.updatePerson("person-1", "New Name")
        ).rejects.toThrow(DataIntegrityError);
      });
    });

    describe("deletePerson", () => {
      it("should delete person successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        await dbService.deletePerson("person-1");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "DELETE FROM persons WHERE id = ?",
          ["person-1"]
        );
      });

      it("should throw NotFoundError if person does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(dbService.deletePerson("non-existent")).rejects.toThrow(
          NotFoundError
        );
      });

      it("should throw DataIntegrityError if delete fails", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);
        mockDb.runAsync.mockResolvedValueOnce({ changes: 0 });

        await expect(dbService.deletePerson("person-1")).rejects.toThrow(
          DataIntegrityError
        );
      });
    });
  });

  describe("Necessity Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("createNecessity", () => {
      it("should create necessity successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const necessity = await dbService.createNecessity(
          "person-1",
          "Sleep",
          "8 hours of sleep"
        );

        expect(necessity.name).toBe("Sleep");
        expect(necessity.description).toBe("8 hours of sleep");
        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT INTO necessities (id, person_id, name, description) VALUES (?, ?, ?, ?)",
          [expect.any(String), "person-1", "Sleep", "8 hours of sleep"]
        );
      });

      it("should throw NotFoundError if person does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.createNecessity("non-existent", "Sleep", "8 hours")
        ).rejects.toThrow(NotFoundError);
      });

      it("should validate name length", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        await expect(
          dbService.createNecessity("person-1", "", "Description")
        ).rejects.toThrow(ValidationError);
      });

      it("should validate description length", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "person-1",
          name: "John Doe",
        });
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const longDescription = "a".repeat(1001);
        await expect(
          dbService.createNecessity("person-1", "Name", longDescription)
        ).rejects.toThrow(ValidationError);
      });
    });

    describe("getNecessity", () => {
      it("should get necessity by id", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "necessity-1",
          name: "Sleep",
          description: "8 hours",
        });

        const necessity = await dbService.getNecessity("necessity-1");

        expect(necessity).not.toBeNull();
        expect(necessity?.name).toBe("Sleep");
        expect(necessity?.description).toBe("8 hours");
      });

      it("should return null for non-existent necessity", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        const necessity = await dbService.getNecessity("non-existent");

        expect(necessity).toBeNull();
      });
    });

    describe("updateNecessity", () => {
      it("should update necessity successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "necessity-1",
          name: "Sleep",
          description: "8 hours",
        });

        await dbService.updateNecessity(
          "necessity-1",
          "Sleep More",
          "9 hours of sleep"
        );

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "UPDATE necessities SET name = ?, description = ? WHERE id = ?",
          ["Sleep More", "9 hours of sleep", "necessity-1"]
        );
      });

      it("should throw NotFoundError if necessity does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.updateNecessity("non-existent", "Name", "Description")
        ).rejects.toThrow(NotFoundError);
      });
    });

    describe("deleteNecessity", () => {
      it("should delete necessity successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "necessity-1",
          name: "Sleep",
          description: "8 hours",
        });

        await dbService.deleteNecessity("necessity-1");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "DELETE FROM necessities WHERE id = ?",
          ["necessity-1"]
        );
      });

      it("should throw NotFoundError if necessity does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(dbService.deleteNecessity("non-existent")).rejects.toThrow(
          NotFoundError
        );
      });
    });
  });

  describe("Todo Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("createTodo", () => {
      it("should create todo successfully", async () => {
        const todo = await dbService.createTodo("Buy groceries", false);

        expect(todo.description).toBe("Buy groceries");
        expect(todo.isDone).toBe(false);
        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT INTO commitments (id, type, description, is_done) VALUES (?, ?, ?, ?)",
          [expect.any(String), "todo", "Buy groceries", 0]
        );
      });

      it("should create completed todo", async () => {
        const todo = await dbService.createTodo("Finished task", true);

        expect(todo.isDone).toBe(true);
        expect(mockDb.runAsync).toHaveBeenCalledWith(expect.any(String), [
          expect.any(String),
          "todo",
          "Finished task",
          1,
        ]);
      });

      it("should validate description", async () => {
        await expect(dbService.createTodo("", false)).rejects.toThrow(
          ValidationError
        );
      });

      it("should validate isDone is boolean", async () => {
        await expect(
          dbService.createTodo("Task", "not boolean" as any)
        ).rejects.toThrow(ValidationError);
      });
    });

    describe("getTodo", () => {
      it("should get todo by id", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "todo-1",
          description: "Buy groceries",
          is_done: 0,
        });

        const todo = await dbService.getTodo("todo-1");

        expect(todo).not.toBeNull();
        expect(todo?.description).toBe("Buy groceries");
        expect(todo?.isDone).toBe(false);
      });

      it("should return null for non-existent todo", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        const todo = await dbService.getTodo("non-existent");

        expect(todo).toBeNull();
      });

      it("should convert is_done 1 to true", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "todo-1",
          description: "Task",
          is_done: 1,
        });

        const todo = await dbService.getTodo("todo-1");

        expect(todo?.isDone).toBe(true);
      });
    });

    describe("getAllTodos", () => {
      it("should get all todos", async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: "todo-1", description: "Task 1", is_done: 0 },
          { id: "todo-2", description: "Task 2", is_done: 1 },
        ]);

        const todos = await dbService.getAllTodos();

        expect(todos).toHaveLength(2);
        expect(todos[0].description).toBe("Task 1");
        expect(todos[0].isDone).toBe(false);
        expect(todos[1].isDone).toBe(true);
      });

      it("should return empty array when no todos exist", async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([]);

        const todos = await dbService.getAllTodos();

        expect(todos).toEqual([]);
      });
    });

    describe("updateTodo", () => {
      it("should update todo successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "todo-1",
          description: "Old task",
          is_done: 0,
        });

        await dbService.updateTodo("todo-1", "New task", true);

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "UPDATE commitments SET description = ?, is_done = ? WHERE id = ? AND type = ?",
          ["New task", 1, "todo-1", "todo"]
        );
      });

      it("should throw NotFoundError if todo does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.updateTodo("non-existent", "Task", false)
        ).rejects.toThrow(NotFoundError);
      });
    });

    describe("deleteTodo", () => {
      it("should delete todo successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "todo-1",
          description: "Task",
          is_done: 0,
        });

        await dbService.deleteTodo("todo-1");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "DELETE FROM commitments WHERE id = ? AND type = ?",
          ["todo-1", "todo"]
        );
      });

      it("should throw NotFoundError if todo does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(dbService.deleteTodo("non-existent")).rejects.toThrow(
          NotFoundError
        );
      });
    });
  });

  describe("ToKeep Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("createToKeep", () => {
      it("should create tokeep successfully", async () => {
        const tokeep = await dbService.createToKeep("Exercise daily", false);

        expect(tokeep.description).toBe("Exercise daily");
        expect(tokeep.isDone).toBe(false);
        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT INTO commitments (id, type, description, is_done) VALUES (?, ?, ?, ?)",
          [expect.any(String), "tokeep", "Exercise daily", 0]
        );
      });
    });

    describe("getToKeep", () => {
      it("should get tokeep by id", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "tokeep-1",
          description: "Exercise daily",
          is_done: 0,
        });

        const tokeep = await dbService.getToKeep("tokeep-1");

        expect(tokeep).not.toBeNull();
        expect(tokeep?.description).toBe("Exercise daily");
      });
    });
  });

  describe("Pillar Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("createPillar", () => {
      it("should create pillar successfully", async () => {
        const pillar = await dbService.createPillar("Communication", "high", 8);

        expect(pillar.name).toBe("Communication");
        expect(pillar.priority).toBe("high");
        expect(pillar.satisfaction).toBe(8);
        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "INSERT INTO pillars (id, name, priority, satisfaction) VALUES (?, ?, ?, ?)",
          [expect.any(String), "Communication", "high", 8]
        );
      });

      it("should validate priority", async () => {
        await expect(
          dbService.createPillar("Name", "invalid", 8)
        ).rejects.toThrow(ValidationError);
        await expect(
          dbService.createPillar("Name", "invalid", 8)
        ).rejects.toThrow("Invalid priority");
      });

      it("should validate satisfaction range", async () => {
        await expect(
          dbService.createPillar("Name", "high", 0)
        ).rejects.toThrow(ValidationError);

        await expect(
          dbService.createPillar("Name", "high", 11)
        ).rejects.toThrow(ValidationError);

        await expect(
          dbService.createPillar("Name", "high", 5.5)
        ).rejects.toThrow(ValidationError);
      });
    });

    describe("getPillar", () => {
      it("should get pillar by id", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "pillar-1",
          name: "Communication",
          priority: "high",
          satisfaction: 8,
        });

        const pillar = await dbService.getPillar("pillar-1");

        expect(pillar).not.toBeNull();
        expect(pillar?.name).toBe("Communication");
        expect(pillar?.priority).toBe("high");
        expect(pillar?.satisfaction).toBe(8);
      });
    });

    describe("getAllPillars", () => {
      it("should get all pillars", async () => {
        mockDb.getAllAsync.mockResolvedValueOnce([
          { id: "pillar-1", name: "Communication", priority: "high", satisfaction: 8 },
          { id: "pillar-2", name: "Trust", priority: "very high", satisfaction: 9 },
        ]);

        const pillars = await dbService.getAllPillars();

        expect(pillars).toHaveLength(2);
        expect(pillars[0].name).toBe("Communication");
        expect(pillars[1].name).toBe("Trust");
      });
    });
  });

  describe("UpLove Operations", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    describe("createUpLove", () => {
      it("should create uplove successfully with transaction", async () => {
        const date = new Date("2025-01-01");

        // Mock pillars exist
        mockDb.getFirstAsync
          .mockResolvedValueOnce({
            id: "pillar-1",
            name: "Communication",
            priority: "high",
            satisfaction: 8,
          })
          .mockResolvedValueOnce({
            id: "pillar-2",
            name: "Trust",
            priority: "high",
            satisfaction: 9,
          });

        const upLove = await dbService.createUpLove(
          date,
          ["pillar-1", "pillar-2"],
          ["Improve communication"],
          ["Great trust building"]
        );

        expect(upLove.pillars).toHaveLength(2);
        expect(upLove.toImprove).toEqual(["Improve communication"]);
        expect(upLove.toPraise).toEqual(["Great trust building"]);
        expect(mockDb.withTransactionAsync).toHaveBeenCalled();
      });

      it("should validate pillarIds array can be empty", async () => {
        const date = new Date("2025-01-01");

        const upLove = await dbService.createUpLove(date, [], [], []);

        expect(upLove.pillars).toEqual([]);
      });

      it("should validate string arrays", async () => {
        const date = new Date("2025-01-01");

        await expect(
          dbService.createUpLove(date, ["pillar-1"], ["  "], [])
        ).rejects.toThrow(ValidationError);
      });

      it("should reject duplicate items", async () => {
        const date = new Date("2025-01-01");

        await expect(
          dbService.createUpLove(
            date,
            ["pillar-1"],
            ["Item 1", "Item 1"],
            []
          )
        ).rejects.toThrow(ValidationError);
        await expect(
          dbService.createUpLove(
            date,
            ["pillar-1"],
            ["Item 1", "Item 1"],
            []
          )
        ).rejects.toThrow("toImprove contains duplicate values");
      });

      it("should throw NotFoundError if pillar does not exist", async () => {
        const date = new Date("2025-01-01");
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.createUpLove(date, ["non-existent"], [], [])
        ).rejects.toThrow(NotFoundError);
      });
    });

    describe("getUpLove", () => {
      it("should get uplove by id", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "uplove-1",
          date: Date.now(),
        });
        mockDb.getAllAsync
          .mockResolvedValueOnce([{ pillar_id: "pillar-1" }])
          .mockResolvedValueOnce([{ content: "Improve this" }])
          .mockResolvedValueOnce([{ content: "Praise that" }]);

        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "pillar-1",
          name: "Communication",
          priority: "high",
          satisfaction: 8,
        });

        const upLove = await dbService.getUpLove("uplove-1");

        expect(upLove).not.toBeNull();
        expect(upLove?.pillars).toHaveLength(1);
        expect(upLove?.toImprove).toEqual(["Improve this"]);
        expect(upLove?.toPraise).toEqual(["Praise that"]);
      });
    });

    describe("updateUpLove", () => {
      it("should update uplove with transaction", async () => {
        // Mock uplove exists
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "uplove-1",
          date: Date.now(),
        });
        mockDb.getAllAsync
          .mockResolvedValueOnce([]) // pillars
          .mockResolvedValueOnce([]) // to improve
          .mockResolvedValueOnce([]); // to praise

        await dbService.updateUpLove(
          "uplove-1",
          [],
          ["New item to improve"],
          ["New item to praise"]
        );

        expect(mockDb.withTransactionAsync).toHaveBeenCalled();
      });

      it("should throw NotFoundError if uplove does not exist", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce(null);

        await expect(
          dbService.updateUpLove("non-existent", [], [], [])
        ).rejects.toThrow(NotFoundError);
      });
    });

    describe("deleteUpLove", () => {
      it("should delete uplove successfully", async () => {
        mockDb.getFirstAsync.mockResolvedValueOnce({
          id: "uplove-1",
          date: Date.now(),
        });
        mockDb.getAllAsync
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([]);

        await dbService.deleteUpLove("uplove-1");

        expect(mockDb.runAsync).toHaveBeenCalledWith(
          "DELETE FROM up_loves WHERE id = ?",
          ["uplove-1"]
        );
      });
    });
  });

  describe("Validation Edge Cases", () => {
    beforeEach(async () => {
      mockDb.getFirstAsync.mockResolvedValue({ foreign_keys: 1 });
      await dbService.initialize();
    });

    it("should validate string arrays properly", async () => {
      const date = new Date("2025-01-01");

      // Empty string in array
      await expect(
        dbService.createUpLove(date, ["pillar-1"], [""], [])
      ).rejects.toThrow(ValidationError);

      // Non-string in array
      await expect(
        dbService.createUpLove(
          date,
          ["pillar-1"],
          [123 as any],
          []
        )
      ).rejects.toThrow(ValidationError);
    });

    it("should validate array length limits", async () => {
      const date = new Date("2025-01-01");

      const tooManyItems = Array(51).fill("item");

      await expect(
        dbService.createUpLove(
          date,
          ["pillar-1"],
          tooManyItems,
          []
        )
      ).rejects.toThrow(ValidationError);
    });
  });
});
