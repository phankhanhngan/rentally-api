import { Migration } from '@mikro-orm/migrations';

export class Migration20231113142822_alter_transaction_add_description extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transactions` add `description` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transactions` drop `description`;');
  }

}
