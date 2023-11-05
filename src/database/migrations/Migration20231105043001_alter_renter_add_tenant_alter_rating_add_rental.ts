import { Migration } from '@mikro-orm/migrations';

export class Migration20231105043001_alter_renter_add_tenant_alter_rating_add_rental extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `rental` add `tenants` int not null;');

    this.addSql('alter table `room_ratings` add `rental_id` int unsigned not null;');
    this.addSql('alter table `room_ratings` add constraint `room_ratings_rental_id_foreign` foreign key (`rental_id`) references `rental` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `room_ratings` add unique `room_ratings_rental_id_unique`(`rental_id`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `room_ratings` drop foreign key `room_ratings_rental_id_foreign`;');

    this.addSql('alter table `rental` drop `tenants`;');

    this.addSql('alter table `room_ratings` drop index `room_ratings_rental_id_unique`;');
    this.addSql('alter table `room_ratings` drop `rental_id`;');
  }

}
