import { Migration } from '@mikro-orm/migrations';

export class Migration20231105020309_new_rental extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `rental` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `landlord_id` int unsigned not null, `renter_id` int unsigned not null, `room_id` varchar(255) not null, `rental_detail_id` int unsigned not null, `status` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `rental` add index `rental_landlord_id_index`(`landlord_id`);',
    );
    this.addSql(
      'alter table `rental` add index `rental_renter_id_index`(`renter_id`);',
    );
    this.addSql(
      'alter table `rental` add index `rental_room_id_index`(`room_id`);',
    );
    this.addSql(
      'alter table `rental` add unique `rental_rental_detail_id_unique`(`rental_detail_id`);',
    );
    this.addSql(
      'alter table `rental` add constraint `rental_landlord_id_foreign` foreign key (`landlord_id`) references `users` (`id`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `rental` add constraint `rental_renter_id_foreign` foreign key (`renter_id`) references `users` (`id`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `rental` add constraint `rental_room_id_foreign` foreign key (`room_id`) references `rooms` (`id`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `rental` add constraint `rental_rental_detail_id_foreign` foreign key (`rental_detail_id`) references `rental_details` (`id`) on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `rental` drop foreign key `rental_rental_detail_id_foreign`;',
    );

    this.addSql(
      'alter table `rental` drop foreign key `rental_landlord_id_foreign`;',
    );

    this.addSql(
      'alter table `rental` drop foreign key `rental_renter_id_foreign`;',
    );

    this.addSql(
      'alter table `rental` drop foreign key `rental_room_id_foreign`;',
    );

    this.addSql('drop table if exists `rental`;');
  }
}
