import { Migration } from '@mikro-orm/migrations';

export class Migration20231126080426_alter_user_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` add `card_number` varchar(255) null, add `card_exp_month` varchar(255) null, add `card_exp_year` varchar(255) null, add `card_cvc` varchar(255) null, add `customer_id` varchar(255) null, add `card_id` varchar(255) null;',
    );
    this.addSql('alter table `users` drop `bank_code`;');
    this.addSql('alter table `users` drop `account_number`;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `users` add `bank_code` varchar(255) null, add `account_number` varchar(255) null;',
    );
    this.addSql('alter table `users` drop `card_number`;');
    this.addSql('alter table `users` drop `card_exp_month`;');
    this.addSql('alter table `users` drop `card_exp_year`;');
    this.addSql('alter table `users` drop `card_cvc`;');
    this.addSql('alter table `users` drop `customer_id`;');
    this.addSql('alter table `users` drop `card_id`;');
  }
}
