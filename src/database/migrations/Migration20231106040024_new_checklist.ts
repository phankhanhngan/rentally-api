import { Migration } from '@mikro-orm/migrations';

export class Migration20231106040024_new_checklist extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `checklist` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `created_id` int not null, `updated_id` int not null, `room_id` varchar(255) not null, `renter_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `checklist` add index `checklist_room_id_index`(`room_id`);');
    this.addSql('alter table `checklist` add index `checklist_renter_id_index`(`renter_id`);');

    this.addSql('alter table `checklist` add constraint `checklist_room_id_foreign` foreign key (`room_id`) references `rooms` (`id`) on update cascade;');
    this.addSql('alter table `checklist` add constraint `checklist_renter_id_foreign` foreign key (`renter_id`) references `users` (`id`) on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `checklist`;');
  }

}
