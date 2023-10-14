import { Migration } from '@mikro-orm/migrations';

export class Migration20231013033857_edit_type_clm_coordinate_table_room_blocks extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists `example`;');

    this.addSql('alter table `roomblocks` modify `coordinate` point;');
  }

  async down(): Promise<void> {
    this.addSql('create table `example` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `roomblocks` modify `coordinate` text;');
  }

}
