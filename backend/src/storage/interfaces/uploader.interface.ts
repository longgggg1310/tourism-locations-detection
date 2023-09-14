import { FileContent, Metadata, MetadataFilter } from '../model';

export interface IUploader {
    upload(metadata: Metadata, content: FileContent, ...metadataFilters: MetadataFilter[]): Promise<any>;
}
