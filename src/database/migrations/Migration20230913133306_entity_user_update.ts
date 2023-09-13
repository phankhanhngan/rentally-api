import { Migration } from '@mikro-orm/migrations';

export class Migration20230913133306_entity_user_update extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` add unique `users_phone_number_unique`(`phone_number`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` drop index `users_phone_number_unique`;');
  }

}
