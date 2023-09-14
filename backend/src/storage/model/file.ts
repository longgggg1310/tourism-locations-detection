import { PathLike } from 'fs';

export interface FileHeaders {
    filename: string;
    contentType: string;
    size?: string;
}

export type FileContent =
    | Uint8Array
    | Blob
    | string
    | PathLike
    | Iterable<Uint8Array>
    | Iterable<number>
    | AsyncIterable<Uint8Array>
    | ReadableStream<Uint8Array>;
