import { randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateCodeUtil {
  six(): string {
    return Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
  }

  opac() {
    return randomBytes(16).toString('hex');
  }
}
