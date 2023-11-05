import { Migration } from '@mikro-orm/migrations';

export class Migration20231105035829_alter_rental_add_attendance extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `rental` add `attendance` int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rental` drop `attendance`;');
  }
}
