import { Injectable } from '@nestjs/common';
import { readDb, updateDb, writeDb, newId, auditLog } from '../database';

@Injectable()
export class DatabaseService {
  readDb = readDb;
  updateDb = updateDb;
  writeDb = writeDb;
  newId = newId;
  auditLog = auditLog;
}
