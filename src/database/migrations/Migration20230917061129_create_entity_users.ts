import { Migration } from '@mikro-orm/migrations';

export class Migration20230917061129_create_entity_users extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `example` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `google_id` varchar(255) null, `email` varchar(255) not null, `password` varchar(255) null, `first_name` varchar(255) not null, `last_name` varchar(255) null, `photo` varchar(255) null, `is_enable` tinyint(1) not null default true, `phone_number` varchar(255) not null, `role` varchar(255) not null, `verification_code` varchar(255) null, `time_stamp` datetime null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `users` add unique `users_google_id_unique`(`google_id`);');
    this.addSql('alter table `users` add unique `users_email_unique`(`email`);');
    this.addSql('alter table `users` add unique `users_phone_number_unique`(`phone_number`);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `example`;');

    this.addSql('drop table if exists `users`;');
  }

}
