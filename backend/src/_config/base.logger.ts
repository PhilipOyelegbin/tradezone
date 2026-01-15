import { Logger } from '@nestjs/common';

export abstract class BaseLogger {
  protected readonly logger: Logger;

  protected constructor(context: string) {
    this.logger = new Logger(context);
  }
}
