import { Migration } from '@mikro-orm/migrations';

export class Migration20230914033606_editNullableTrueColumnTableUsers extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` modify `google_id` varchar(255) null, modify `password` varchar(255) null, modify `last_name` varchar(255) null, modify `photo` varchar(255) null, modify `phone_number` varchar(255) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table `users` modify `google_id` varchar(255) not null, modify `password` varchar(255) not null, modify `last_name` varchar(255) not null, modify `photo` varchar(255) not null, modify `phone_number` varchar(255) not null;',
    );
  }
}
