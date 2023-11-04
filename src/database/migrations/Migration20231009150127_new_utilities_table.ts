import { Migration } from '@mikro-orm/migrations';

export class Migration20231001150127_new_utilities_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `utilities` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `name` varchar(255) not null, `note` varchar(255) null) default character set utf8mb4 engine = InnoDB;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `utilities`;');
  }
}
