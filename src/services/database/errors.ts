export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class NotFoundError extends DatabaseError {
  constructor(resource: string) {
    super(`${resource} not found`, "RESOURCE_NOT_FOUND", 404);
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class DataIntegrityError extends DatabaseError {
  constructor(message: string) {
    super(message, "DATA_INTEGRITY_ERROR", 500);
  }
}
