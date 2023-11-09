import { Migration } from '@mikro-orm/migrations';

export class Migration20231109160009_new_provinve_and_districts extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `districts` (`code` varchar(255) not null, `name` varchar(255) not null, `name_en` varchar(255) not null, `full_name` varchar(255) not null, `full_name_en` varchar(255) not null, `code_name` varchar(255) not null, `province_code` varchar(255) not null, primary key (`code`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `provinces` (`code` varchar(255) not null, `name` varchar(255) not null, `name_en` varchar(255) not null, `full_name` varchar(255) not null, `full_name_en` varchar(255) not null, `code_name` varchar(255) not null, primary key (`code`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `districts`;');

    this.addSql('drop table if exists `provinces`;');
  }

}
