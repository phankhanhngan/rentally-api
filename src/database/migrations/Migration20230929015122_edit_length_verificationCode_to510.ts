import { Migration } from '@mikro-orm/migrations';

export class Migration20230929015122_edit_length_verificationCode_to510 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `verification_code` varchar(510);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `users` modify `verification_code` varchar(255);');
  }

}
