import fs from 'node:fs';
import path from 'node:path';

class Logger {
  private logPath: string;

  constructor() {
    this.logPath = path.join(process.cwd(), 'data', 'audit.log');
    this.ensureDir();
  }

  private ensureDir() {
    const dir = path.dirname(this.logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private write(level: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, ...(meta && { meta }) };
    const logString = JSON.stringify(logEntry);
    
    const color = level === 'ERROR' ? '\x1b[31m' : level === 'WARN' ? '\x1b[33m' : '\x1b[32m';
    console.log(`${color}[${level}]\x1b[0m ${message}`);
    fs.appendFileSync(this.logPath, logString + '\n');
  }

  info(message: string, meta?: any) { this.write('INFO', message, meta); }
  warn(message: string, meta?: any) { this.write('WARN', message, meta); }
  error(message: string, meta?: any) { this.write('ERROR', message, meta); }
}

export const logger = new Logger();
