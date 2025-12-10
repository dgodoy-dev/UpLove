import Priority, {
  isPriority,
  priorities,
} from "@/src/entities/types/Priority";
import { ValidationError } from "./errors";

export default class DatabaseValidator {
  public validateString(
    value: string,
    fieldName: string,
    minLength: number = 1,
    maxLength: number = 255
  ): string {
    if (typeof value !== "string") {
      throw new ValidationError(`${fieldName} must be a string`);
    }

    const trimmed = value.trim();

    if (trimmed.length < minLength) {
      throw new ValidationError(
        `${fieldName} must be at least ${minLength} characters`
      );
    }

    if (trimmed.length > maxLength) {
      throw new ValidationError(
        `${fieldName} must not exceed ${maxLength} characters`
      );
    }

    // Prevent null bytes and control characters
    if (/[\u0000-\u001F\u007F-\u009F]/.test(trimmed)) {
      throw new ValidationError(`${fieldName} contains invalid characters`);
    }

    return trimmed;
  }

  public validatePriority(value: string): Priority {
    if (!isPriority(value)) {
      throw new ValidationError(
        `Invalid priority: ${value}. Must be one of: ${priorities.join(", ")}`
      );
    }

    return value as Priority;
  }

  public validateSatisfaction(value: number): void {
    if (typeof value !== "number") {
      throw new ValidationError("Satisfaction must be a number");
    }

    if (!Number.isFinite(value)) {
      throw new ValidationError("Satisfaction must be a finite number");
    }

    if (!Number.isInteger(value)) {
      throw new ValidationError("Satisfaction must be an integer");
    }

    if (value < 1 || value > 10) {
      throw new ValidationError("Satisfaction must be between 1 and 10");
    }
  }

  public validateBoolean(value: boolean, fieldName: string): boolean {
    if (typeof value !== "boolean") {
      throw new ValidationError(`${fieldName} must be a boolean`);
    }
    return value;
  }

  public validateDate(
    date: Date,
    fieldName: string,
    allowFuture: boolean = true
  ): void {
    if (!(date instanceof Date)) {
      throw new ValidationError(`${fieldName} must be a Date object`);
    }

    if (isNaN(date.getTime())) {
      throw new ValidationError(`${fieldName} is not a valid date`);
    }

    if (!allowFuture && date > new Date()) {
      throw new ValidationError(`${fieldName} cannot be in the future`);
    }

    if (date.getFullYear() < 1900) {
      throw new ValidationError(`${fieldName} year must be 1900 or later`);
    }

    if (date.getFullYear() > 2100) {
      throw new ValidationError(`${fieldName} year must be 2100 or earlier`);
    }
  }

  public validateArray<T>(
    value: T[],
    fieldName: string,
    minLength: number = 0,
    maxLength: number = 100
  ): void {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${fieldName} must be an array`);
    }

    if (value.length < minLength) {
      throw new ValidationError(
        `${fieldName} must have at least ${minLength} items`
      );
    }

    if (value.length > maxLength) {
      throw new ValidationError(
        `${fieldName} must not exceed ${maxLength} items`
      );
    }
  }

  public validateStringArray(
    values: string[],
    fieldName: string,
    minLength: number = 0,
    maxLength: number = 100
  ): string[] {
    this.validateArray(values, fieldName, minLength, maxLength);

    const trimmedValues = values.map((value, index) => {
      if (typeof value !== "string" || value.trim().length === 0) {
        throw new ValidationError(
          `${fieldName}[${index}] must be a non-empty string`
        );
      }
      return value.trim();
    });

    // Check for duplicates
    const unique = new Set(trimmedValues);
    if (unique.size !== trimmedValues.length) {
      throw new ValidationError(`${fieldName} contains duplicate values`);
    }

    return trimmedValues;
  }
}
