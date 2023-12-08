import { Migration } from '@mikro-orm/migrations';

export class Migration20231203095111_alter_user_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` add `stripe_account_id` varchar(255) null, add `stripe_bank_account_id` varchar(255) null',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` drop `stripe_account_id`;');
    this.addSql('alter table `users` drop `stripe_bank_account_id`;');
  }
}
