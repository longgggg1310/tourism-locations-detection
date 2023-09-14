import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, Index } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    cid?: string;

    @Column()
    storage?: string;

    @Column()
    originalname?: string;

    @Column()
    filename?: string;

    @Column()
    mimeType?: string;

    @Column()
    size?: string;

    @Column({ nullable: true })
    cdnUrl?: string;

    @Column({ type: 'json', nullable: true, default: {} })
    attribute?: any;

    @Column()
    @Index()
    createdAt?: Date;

    @Column({ nullable: true })
    @Index()
    resizeThumbnail?: string;

    @Column({ nullable: true })
    @Index()
    smallThumbnail?: string;
}
