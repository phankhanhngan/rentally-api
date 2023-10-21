import { Migration } from '@mikro-orm/migrations';

export class Migration20231008081204_update_field_phoneNumber_isNullable extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `users` modify `phone_number` varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `users` modify `phone_number` varchar(255) not null;',
    );
  }
}
