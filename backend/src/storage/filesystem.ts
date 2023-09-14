import { registerAs } from '@nestjs/config';

export default registerAs('filesystem', () => ({
    default: 'tracks',
    disks: {
        // tracks: {
        //     driver: 's3',
        //     bucket: process.env.AWS_S3_DOCS_BUCKET,
        //     key: process.env.AWS_KEY,
        //     secret: process.env.AWS_SECRET,
        //     region: process.env.AWS_REGION,
        // },
        tracks: {
            driver: 'local',
            basePath: `${process.env.BASE_PATH}/data-demo/`, // fully qualified path of the folder
            baseUrl: 'https://localhost:3001',
        },
    },
}));
