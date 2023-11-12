import { Migration } from '@mikro-orm/migrations';

export class Migration20231102075523_new_rental_details extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `rental_details` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `move_in_date` datetime not null, `move_out_date` datetime not null, `lease_term` int not null, `monthly_rent` numeric(10,0) not null, `lease_termination_cost` numeric(10,0) null, `renter_identify_no` varchar(255) not null, `landlord_identify_no` varchar(255) not null, `renter_identify_date` datetime null, `landlord_identify_date` datetime null, `renter_identify_address` varchar(255) null, `landlord_identify_address` varchar(255) null, `renter_birthday` datetime not null, `landlord_birthday` datetime not null, `electric_price` numeric(10,0) not null, `water_price` numeric(10,0) not null, `addtional_price` numeric(10,0) not null) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `rental_details`;');
  }

}
