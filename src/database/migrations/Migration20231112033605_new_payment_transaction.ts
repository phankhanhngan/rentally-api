import { Migration } from '@mikro-orm/migrations';

export class Migration20231112033605_new_payment_transaction extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `payments` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `deleted_at` datetime null, `rental_id` int unsigned not null, `total_price` numeric(10,0) not null, `electric_number` int not null, `total_electric_price` numeric(10,0) not null, `water_number` int not null, `total_water_price` numeric(10,0) not null, `additional_price` numeric(10,0) not null default 0, `status` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'create table `transactions` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `deleted_at` datetime null, `payment_id` int unsigned not null, `status` varchar(255) not null) default character set utf8mb4 engine = InnoDB;',
    );
    this.addSql(
      'alter table `transactions` add index `transactions_payment_id_index`(`payment_id`);',
    );

    this.addSql(
      'alter table `payments` add constraint `payments_rental_id_foreign` foreign key (`rental_id`) references `rental` (`id`) on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table `transactions` add constraint `transactions_payment_id_foreign` foreign key (`payment_id`) references `payments` (`id`) on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `transactions` drop foreign key `transactions_payment_id_foreign`;',
    );

    this.addSql('drop table if exists `payments`;');

    this.addSql('drop table if exists `transactions`;');
  }
}
