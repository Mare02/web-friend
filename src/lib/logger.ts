/**
 * Production-ready logging utility
 * Provides structured logging with different levels and context
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  [key: string]: unknown
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
}

class Logger {
  private level: LogLevel

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level]
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    const errorStr = entry.error ? ` Error: ${entry.error.message}${entry.error.stack ? `\n${entry.error.stack}` : ''}` : ''

    return `[${entry.timestamp}] ${levelName}: ${entry.message}${contextStr}${errorStr}`
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }

    const formattedMessage = this.formatMessage(entry)

    // In production, you might want to send logs to a service like DataDog, LogRocket, etc.
    // For now, we'll use console methods
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage)
        break
      case LogLevel.INFO:
        console.info(formattedMessage)
        break
      case LogLevel.WARN:
        console.warn(formattedMessage)
        break
      case LogLevel.ERROR:
        console.error(formattedMessage)
        break
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  // Convenience methods for common operations
  apiCall(operation: string, duration?: number, context?: LogContext): void {
    const message = `API Call: ${operation}${duration ? ` (${duration}ms)` : ''}`
    this.info(message, { ...context, operation, duration })
  }

  databaseQuery(operation: string, duration?: number, context?: LogContext): void {
    const message = `Database Query: ${operation}${duration ? ` (${duration}ms)` : ''}`
    this.debug(message, { ...context, operation, duration })
  }

  userAction(action: string, userId?: string, context?: LogContext): void {
    const message = `User Action: ${action}${userId ? ` (User: ${userId})` : ''}`
    this.info(message, { ...context, action, userId })
  }

  performance(metric: string, value: number, context?: LogContext): void {
    const message = `Performance: ${metric} = ${value}`
    this.info(message, { ...context, metric, value })
  }
}

// Create a global logger instance
// In production, you might want to set this to WARN or ERROR
const logLevel = process.env.LOG_LEVEL
  ? LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] ?? LogLevel.INFO
  : LogLevel.INFO

export const logger = new Logger(logLevel)

// Export types for use in other modules
export type { LogContext }
