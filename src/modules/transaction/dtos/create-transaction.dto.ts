import { TransactionStatus } from 'src/common/enum/common.enum';

export class TransactionDTO {
  description: string;
  status: TransactionStatus;
}
