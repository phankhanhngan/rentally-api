import { Migration } from '@mikro-orm/migrations';

export class Migration20231014085650_expose_clm_address_table_room_blocks extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `roomblocks` add `address_line1` text null, add `address_line2` text null, add `city` text null, add `state` text null, add `country` text null;');
    this.addSql('alter table `roomblocks` modify `coordinate` point not null;');
    this.addSql('alter table `roomblocks` drop `address`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `roomblocks` add `address` text not null;');
    this.addSql('alter table `roomblocks` modify `coordinate` point null;');
    this.addSql('alter table `roomblocks` drop `address_line1`;');
    this.addSql('alter table `roomblocks` drop `address_line2`;');
    this.addSql('alter table `roomblocks` drop `city`;');
    this.addSql('alter table `roomblocks` drop `state`;');
    this.addSql('alter table `roomblocks` drop `country`;');
  }

}
