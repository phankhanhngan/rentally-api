import { Migration } from '@mikro-orm/migrations';

export class Migration20231119144801_update_user_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` add `bank_code` varchar(255) null, add `account_number` varchar(255) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` drop `bank_code`;');
    this.addSql('alter table `users` drop `account_number`;');
  }
}
