import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Validate } from 'class-validator';

export class FilterMessageDTO {
  @Validate((_, value) => value > 0, { message: 'pageNo must be bigger 0' })
  @IsInt({ message: 'pageNo must be an integer' })
  @Type(() => Number)
  pageNo?: number = Constant.DEFAULT_PAGENO;

  @IsOptional()
  @IsIn(['id', 'googleId', 'email', 'firstName', 'role'], {
    message: 'sortField must be one of id, googleId, email, firstName, role',
  })
  sortField?: string = Constant.DEFAULT_SORTFIELD;

  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDir must be one of asc, desc',
  })
  sortDir?: string = Constant.DEFAULT_SORTDIR;
  
  @IsOptional()
  keyword?: string = Constant.DEFAULT_KEYWORD;

  @Validate((_, value) => value > 0, { message: 'limit must be bigger 0' })
  @IsInt({ message: 'limit must be an integer' })
  @Type(() => Number)
  limit?: number = Constant.DEFAULT_LIMIT;
}

export enum Constant {
  DEFAULT_PAGENO = 1,
  DEFAULT_SORTFIELD = 'id',
  DEFAULT_SORTDIR = 'asc',
  DEFAULT_KEYWORD = '',
  DEFAULT_LIMIT = 5,
}
