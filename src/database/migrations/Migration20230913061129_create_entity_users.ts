import { Migration } from '@mikro-orm/migrations';

export class Migration20230913133148_entity_user extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `google_id` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) not null, `first_name` varchar(255) not null, `last_name` varchar(255) not null, `photo` varchar(255) not null, `is_enable` tinyint(1) not null default true, `phone_number` varchar(255) not null, `role` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `users` add unique `users_google_id_unique`(`google_id`);',
    );
    this.addSql(
      'alter table `users` add unique `users_email_unique`(`email`);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `users`;');
  }
}
