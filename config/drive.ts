import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  // @ts-ignore
  default: env.get('DRIVE_DISK'),

  services: {
    /**
     * Persist files on Digital Ocean spaces
     */
    s3: services.s3({
      credentials: {
        accessKeyId: env.get('SCW_ACCESS_KEY'),
        secretAccessKey: env.get('SCW_SECRET_KEY'),
      },
      region: env.get('SCW_REGION'),
      bucket: env.get('SCW_BUCKET'),
      endpoint: env.get('SCW_ENPOINT'),
      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
