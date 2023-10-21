import { Migration } from '@mikro-orm/migrations';

export class Migration20231019084342 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `rooms` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `roomblock_id` int unsigned not null, `room_name` varchar(255) not null, `area` numeric(10,0) not null, `price` bigint not null, `deposit_amount` bigint not null, `images` text not null, `utilities` text null, `status` text null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `rooms` add index `rooms_roomblock_id_index`(`roomblock_id`);');

    this.addSql('create table `utilities` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `name` varchar(255) not null, `note` varchar(255) null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `rooms` add constraint `rooms_roomblock_id_foreign` foreign key (`roomblock_id`) references `roomblocks` (`id`) on update cascade on delete cascade;');

    this.addSql('alter table `roomblocks` add constraint `roomblocks_landlord_id_foreign` foreign key (`landlord_id`) references `users` (`id`) on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `rooms`;');

    this.addSql('drop table if exists `utilities`;');

    this.addSql('alter table `roomblocks` drop foreign key `roomblocks_landlord_id_foreign`;');
  }

}
