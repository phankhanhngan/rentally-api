import { Migration } from '@mikro-orm/migrations';

export class Migration20231015084104_alter_tbl_rooms_update_cln_area_type_decimal extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rooms` modify `area` numeric(10,0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rooms` modify `area` varchar(255) not null;');
  }

}
