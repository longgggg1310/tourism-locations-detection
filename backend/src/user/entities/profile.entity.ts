import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Index } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('increment')
    id?: number;

    @Column({ nullable: true })
    phone?: string;

    @Column('date', { nullable: true })
    birthday?: Date;

    @Column({ nullable: true })
    website?: string;

    @Column({ nullable: true })
    occupation?: string;

    @Column({ nullable: true })
    theme?: string;

    @Column({ nullable: true })
    language?: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user?: User;
}
