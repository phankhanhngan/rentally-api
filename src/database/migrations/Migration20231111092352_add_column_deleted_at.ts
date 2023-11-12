import { Migration } from '@mikro-orm/migrations';

export class Migration20231111092352_add_column_deleted_at extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rental_details` add `deleted_at` datetime null;');

    this.addSql('alter table `users` add `deleted_at` datetime null;');

    this.addSql('alter table `roomblocks` add `deleted_at` datetime null;');

    this.addSql('alter table `rooms` add `deleted_at` datetime null;');

    this.addSql('alter table `rental` add `deleted_at` datetime null;');

    this.addSql('alter table `room_ratings` add `deleted_at` datetime null;');

    this.addSql('alter table `checklist` add `deleted_at` datetime null;');

    this.addSql('alter table `utilities` add `deleted_at` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `rental_details` drop `deleted_at`;');

    this.addSql('alter table `users` drop `deleted_at`;');

    this.addSql('alter table `roomblocks` drop `deleted_at`;');

    this.addSql('alter table `rooms` drop `deleted_at`;');

    this.addSql('alter table `rental` drop `deleted_at`;');

    this.addSql('alter table `room_ratings` drop `deleted_at`;');

    this.addSql('alter table `checklist` drop `deleted_at`;');

    this.addSql('alter table `utilities` drop `deleted_at`;');
  }

}
