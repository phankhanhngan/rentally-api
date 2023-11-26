import { Migration } from '@mikro-orm/migrations';

export class Migration20231117051711_create_table_notification extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `notifications` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `renter_id` int not null, `message` text not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `districts` add index `districts_code_index`(`code`);');

    this.addSql('alter table `provinces` add index `provinces_code_index`(`code`);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `notifications`;');

    this.addSql('alter table `districts` drop index `districts_code_index`;');

    this.addSql('alter table `provinces` drop index `provinces_code_index`;');
  }

}
