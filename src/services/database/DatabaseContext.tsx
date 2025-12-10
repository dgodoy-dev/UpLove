import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";

import { DatabaseService } from "./DatabaseService";
import { IDatabase } from "./IDatabase";
import DatabaseValidator from "./DatabaseValidator";

type DatabaseContextValue = {
  db: IDatabase | null;
  initializing: boolean;
  error: Error | null;
};

export const DatabaseContext = createContext<DatabaseContextValue | undefined>(
  undefined
);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<IDatabase | null>(null);
  const [initializing, setInitilizing] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    // ! Here you change the IDatabase of the whole app.
    const instance: IDatabase = new DatabaseService(new DatabaseValidator());

    async function setUp() {
      try {
        setInitilizing(true);
        await instance.initialize();
        if (!cancelled) setDb(instance);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setInitilizing(false);
      }
    }

    setUp();

    return () => {
      cancelled = true;
      instance.close().catch((err) => {
        console.warn("Error closing database:", err);
      });
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, initializing, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const dbContext = useContext(DatabaseContext);

  if (!dbContext)
    throw new Error("useDatabase must be used within a DatabaseProvider");

  if (!dbContext.db && !dbContext.initializing)
    throw new Error("useDatabase must be used with a non null database");

  return dbContext;
}
