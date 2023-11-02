export enum Role {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

export enum RoomStatus {
  OCCUPIED = 'Occupied',
  EMPTY = 'Empty',
}

export enum Constant {
  DEFAULT_PAGENO = 1,
  // DEFAULT_SORTFIELD = 'id',
  DEFAULT_SORTDIR = 'asc',
  DEFAULT_KEYWORD = '',
  DEFAULT_LIMIT = 10,
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  REGISTING = 'REGISTING',
}

export enum RentalStatus {
  CREATED = 'CREATED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REQUEST_BREAK = 'REQUEST_BREAK',
  BROKEN = 'BROKEN',
  ENDED = 'ENDED',
}
