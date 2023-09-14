import { FileHeaders } from './file';

export type Metadata = FileHeaders & {
    id: ID;
    path: string;
    bucket?: string;
    key?: string;
    storage: 's3fs' | 'ipfs';
    widthThumbnail?: string;
    heightThumbnail?: string;
};

export type ID = string | Buffer;

export const metadataPath = (path: string): string => `.meta-${path}`;

export type MetadataFilter = (meta: Metadata, ...args: string[]) => Promise<Metadata>;
