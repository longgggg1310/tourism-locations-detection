import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
    Entity,
    Column,
    CreateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';

export enum UserRoleEnum {
    USER = 'USER',
    ADMIN = 'ADMIN',
}
export enum EmailVerifyStatusEnum {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: null })
    @Index()
    name!: string;

    @Column({ nullable: true, default: null })
    @Index()
    email!: string;

    @Column()
    @Exclude()
    password?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column()
    nonce!: string;

    @Column({ nullable: true })
    @Index()
    verify?: string;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    token?: string;

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Profile;

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER,
        nullable: true,
    })
    @Index()
    role?: UserRoleEnum;

    @Column({ nullable: true })
    lastPasswordResetRequest?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        const salt = await bcrypt.genSalt();
        if (this.password && !/^\$2a\$\d+\$/.test(this.password)) {
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    @BeforeInsert()
    async genNonce() {
        const salt = await bcrypt.genSalt();
        this.nonce = salt;
    }
    async checkPassword(plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.password);
    }
}
