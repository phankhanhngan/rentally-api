import { Migration } from '@mikro-orm/migrations';

export class Migration20230916054804_edit_table_uscer extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `users` add `time_stamp` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` drop `time_stamp`;');
  }
}
