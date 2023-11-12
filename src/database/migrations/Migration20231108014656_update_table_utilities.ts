import { Migration } from '@mikro-orm/migrations';

export class Migration20231108014656_update_table_utilities extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `utilities` add `icon` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `utilities` drop `icon`;');
  }

}
