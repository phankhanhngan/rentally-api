import { Migration } from '@mikro-orm/migrations';

export class Migration20231109160224_alter_province_districts extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `districts` add `administrative_unit_id` int not null;');

    this.addSql('alter table `provinces` add `administrative_unit_id` int not null, add `administrative_region_id` int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `districts` drop `administrative_unit_id`;');

    this.addSql('alter table `provinces` drop `administrative_unit_id`;');
    this.addSql('alter table `provinces` drop `administrative_region_id`;');
  }

}
