import { Migration } from '@mikro-orm/migrations';

export class Migration20231112034538_alter_payment_add_year_month_paidAt extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `payments` add `month` int not null, add `year` int not null, add `paid_at` datetime null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `payments` drop `month`;');
    this.addSql('alter table `payments` drop `year`;');
    this.addSql('alter table `payments` drop `paid_at`;');
  }

}
