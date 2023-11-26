import { Migration } from '@mikro-orm/migrations';

export class Migration20231117001706_alter_transac_add_rentalId extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `transactions` drop foreign key `transactions_payment_id_foreign`;');

    this.addSql('alter table `transactions` add `rental_id` int null;');
    this.addSql('alter table `transactions` modify `payment_id` int null;');
    this.addSql('alter table `transactions` drop index `transactions_payment_id_index`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `transactions` modify `payment_id` int unsigned not null;');
    this.addSql('alter table `transactions` drop `rental_id`;');
    this.addSql('alter table `transactions` add constraint `transactions_payment_id_foreign` foreign key (`payment_id`) references `payments` (`id`) on update cascade on delete cascade;');
    this.addSql('alter table `transactions` add index `transactions_payment_id_index`(`payment_id`);');
  }

}
