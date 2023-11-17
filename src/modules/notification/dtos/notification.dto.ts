import { RenterInformationDTO } from './renter-information.dto';
import { PaymentInformationDTO } from './payment-information.dto';

export class NotificationDTO {
  landlordName?: string;
  renter?: RenterInformationDTO;
  payment?: PaymentInformationDTO;
}
