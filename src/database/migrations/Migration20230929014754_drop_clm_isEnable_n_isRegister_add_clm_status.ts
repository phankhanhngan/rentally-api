import { Migration } from '@mikro-orm/migrations';

export class Migration20230929014754_drop_clm_isEnable_n_isRegister_add_clm_status extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` add `status` varchar(255) not null;');
    this.addSql('alter table `users` drop `is_enable`;');
    this.addSql('alter table `users` drop `is_register`;');
    this.addSql('alter table `users` add unique `users_phone_number_unique`(`phone_number`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` add `is_enable` tinyint(1) not null default 1, add `is_register` tinyint(1) not null default 1;');
    this.addSql('alter table `users` drop index `users_phone_number_unique`;');
    this.addSql('alter table `users` drop `status`;');
  }

}
