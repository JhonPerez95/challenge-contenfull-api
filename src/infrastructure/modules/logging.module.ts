import { Module, Global } from '@nestjs/common';
import { AppLoggerService } from '../logging/logger.service';

@Global()
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggingModule {}
