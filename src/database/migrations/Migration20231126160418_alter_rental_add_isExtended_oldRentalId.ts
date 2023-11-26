import { Migration } from '@mikro-orm/migrations';

export class Migration20231126160418_alter_rental_add_isExtended_oldRentalId extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rental` add `is_extended` tinyint(1) null default false, add `old_rental_id` int null default null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rental` drop `is_extended`;');
    this.addSql('alter table `rental` drop `old_rental_id`;');
  }

}
