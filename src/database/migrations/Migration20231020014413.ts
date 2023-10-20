import { Migration } from '@mikro-orm/migrations';

export class Migration20231020014413 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rooms` modify `id` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rooms` modify `id` int unsigned not null auto_increment;');
  }

}
