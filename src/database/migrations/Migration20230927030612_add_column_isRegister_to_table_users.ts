import { Migration } from '@mikro-orm/migrations';

export class Migration20230927030612_add_column_isRegister_to_table_users extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `example` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null) default character set utf8mb4 engine = InnoDB;',
    );

    this.addSql(
      'alter table `users` add `is_register` tinyint(1) not null default true;',
    );
    this.addSql(
      'alter table `users` modify `phone_number` varchar(255) not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `example`;');

    this.addSql('alter table `users` modify `phone_number` varchar(255) null;');
    this.addSql('alter table `users` drop `is_register`;');
  }
}
