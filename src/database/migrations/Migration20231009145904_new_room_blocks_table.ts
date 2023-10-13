import { Migration } from '@mikro-orm/migrations';

export class Migration20231001145904_new_room_blocks_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `roomblocks` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `address` text not null, `coordinate` text null, `description` text not null, `landlord_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `roomblocks` add index `roomblocks_landlord_id_index`(`landlord_id`);',
    );
    this.addSql(
      'alter table `roomblocks` add constraint `roomblocks_landlord_id_foreign` foreign key (`landlord_id`) references `users` (`id`) on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `roomblocks` drop foreign key `roomblocks_landlord_id_foreign`;',
    );

    this.addSql('drop table if exists `roomblocks`;');
  }
}
