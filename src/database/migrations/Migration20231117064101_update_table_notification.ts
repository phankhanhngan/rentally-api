import { Migration } from '@mikro-orm/migrations';

export class Migration20231117064101_update_table_notification extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `notifications` add `payment_id` int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `notifications` drop `payment_id`;');
  }

}
