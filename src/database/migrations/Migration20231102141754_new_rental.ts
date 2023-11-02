import { Migration } from '@mikro-orm/migrations';

export class Migration20231102141754_new_rental extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `rental` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `landlord_id` int unsigned not null, `renter_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `rental` add index `rental_landlord_id_index`(`landlord_id`);');
    this.addSql('alter table `rental` add unique `rental_renter_id_unique`(`renter_id`);');

    this.addSql('alter table `rental` add constraint `rental_landlord_id_foreign` foreign key (`landlord_id`) references `users` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `rental` add constraint `rental_renter_id_foreign` foreign key (`renter_id`) references `users` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `rental_details`;');

    this.addSql('drop table if exists `rental`;');
  }

}
