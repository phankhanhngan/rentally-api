import { Migration } from '@mikro-orm/migrations';

export class Migration20231115024340_alter_tbl_transaction_add_stripeIid extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transactions` add `stripe_id` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transactions` drop `stripe_id`;');
  }

}
