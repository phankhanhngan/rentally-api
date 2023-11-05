import { Migration } from '@mikro-orm/migrations';

export class Migration20231105050707_alter_rentalDetail_all_nullable extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rental_details` modify `move_in_date` datetime null, modify `move_out_date` datetime null, modify `lease_term` int null, modify `monthly_rent` numeric(10,0) null, modify `renter_identify_no` varchar(255) null, modify `landlord_identify_no` varchar(255) null, modify `renter_birthday` datetime null, modify `landlord_birthday` datetime null, modify `electric_price` numeric(10,0) null, modify `water_price` numeric(10,0) null, modify `addtional_price` numeric(10,0) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rental_details` modify `move_in_date` datetime not null, modify `move_out_date` datetime not null, modify `lease_term` int not null, modify `monthly_rent` numeric(10,0) not null, modify `renter_identify_no` varchar(255) not null, modify `landlord_identify_no` varchar(255) not null, modify `renter_birthday` datetime not null, modify `landlord_birthday` datetime not null, modify `electric_price` numeric(10,0) not null, modify `water_price` numeric(10,0) not null, modify `addtional_price` numeric(10,0) not null;');
  }

}
