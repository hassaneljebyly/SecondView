import type { ValidationConfig, ValidationErrors } from '@shared/types/validation';

/**
 * Abstract base class for implementing the Chain of Responsibility pattern
 * in validation logic.
 * Each `ValidationHandler` can perform a validation step and optionally
 * delegate to the next handler in the chain.
 */
export abstract class ValidationHandler {
  /**
   * Reference to the next handler in the validation chain.
   * If not set, this handler will be the last in the chain.
   */
  protected nextHandler?: ValidationHandler;
  /**
   * A collection of validation errors that this handler (and chained handlers)
   * can populate during validation.
   */
  protected errors: ValidationErrors = {};

  /**
   * Sets the next handler in the chain.
   * This allows chaining multiple handlers together.
   * @param handler - The next `ValidationHandler` to process after this one.
   * @returns The handler passed in, to allow fluent chaining.
   * @example
   * const handler1 = new ConcreteHandler1();
   * const handler2 = new ConcreteHandler2();
   * handler1.setNext(handler2);
   */
  public setNext(handler: ValidationHandler): ValidationHandler {
    this.nextHandler = handler;
    return handler;
  }

  /**
   * Executes the validation logic of this handler,
   * and passes control to the next handler if one exists.
   * @param context - The validation context containing data and configuration to be validated.
   * @param errors - The shared errors object where validation issues are recorded.
   */
  public validate(context: ValidationConfig, errors: ValidationErrors): void {
    this.errors = errors;
    // Only continue validation if the form schema is valid so far
    if (errors['validFormSchema'] !== false) {
      // Perform this handler's validation logic
      this.handle(context);

      // Pass validation responsibility to the next handler, if available
      if (this.nextHandler) {
        this.nextHandler.validate(context, this.errors);
      }
    }
  }

  /**
   * Abstract method for handling validation logic.
   * Must be implemented by concrete subclasses.
   * @param context - The validation context containing data and configuration to be validated.
   */
  protected abstract handle(context: ValidationConfig): void;

  getErrors() {
    return this.errors;
  }
}
