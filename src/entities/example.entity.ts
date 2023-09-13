import { Entity } from '@mikro-orm/core';
import { Base } from './base.entity';

@Entity()
export class Example extends Base {}
