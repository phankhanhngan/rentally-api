import { Migration } from '@mikro-orm/migrations';

export class Migration20230914034037_addColumnVerificationCode extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table `users` add `verification_code` varchar(255) null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` drop `verification_code`;');
  }
}
