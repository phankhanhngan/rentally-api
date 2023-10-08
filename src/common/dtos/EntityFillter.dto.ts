import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Validate, ValidateIf } from 'class-validator';
import { Constant } from '../enum/common.enum';

export class FilterMessageDTO {
  @Validate((_, value) => value > 0, { message: 'pageNo must be bigger 0' })
  @IsInt({ message: 'pageNo must be an integer' })
  @Type(() => Number)
  pageNo?: number = Constant.DEFAULT_PAGENO;

  @IsOptional()
  sortField?: string[] = ['id'];

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
