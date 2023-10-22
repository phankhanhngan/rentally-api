import { Migration } from '@mikro-orm/migrations';

export class Migration20231022042809_remove_columns_in_room_blocks_table extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `roomblocks` add `address` text null, add `district` text null;',
    );
    this.addSql('alter table `roomblocks` drop `address_line1`;');
    this.addSql('alter table `roomblocks` drop `address_line2`;');
    this.addSql('alter table `roomblocks` drop `state`;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `roomblocks` add `address_line1` text null, add `address_line2` text null, add `state` text null;',
    );
    this.addSql('alter table `roomblocks` drop `address`;');
    this.addSql('alter table `roomblocks` drop `district`;');
  }
}
