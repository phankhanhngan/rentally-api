import { Migration } from '@mikro-orm/migrations';

export class Migration20231102070534_new_room_rating extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `room_ratings` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `room_id` varchar(255) not null, `renter_id` int unsigned not null, `comment` text null, `clean_rate` int not null, `support_rate` int not null, `location_rate` int not null, `security_rate` int not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `room_ratings` add index `room_ratings_room_id_index`(`room_id`);',
    );
    this.addSql(
      'alter table `room_ratings` add index `room_ratings_renter_id_index`(`renter_id`);',
    );

    this.addSql(
      'alter table `room_ratings` add constraint `room_ratings_room_id_foreign` foreign key (`room_id`) references `rooms` (`id`) on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table `room_ratings` add constraint `room_ratings_renter_id_foreign` foreign key (`renter_id`) references `users` (`id`) on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `room_ratings`;');
  }
}
