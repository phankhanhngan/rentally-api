import { Migration } from '@mikro-orm/migrations';

export class Migration20231105053011_alter_rental_add_ratingstatus extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rental` add `rating_status` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rental` drop `rating_status`;');
  }

}
