# verdaccio-google-cloud-js
![Release](https://github.com/outcome-co/verdaccio-google-cloud-js/workflows/Release/badge.svg?branch=v1.1.7) ![version-badge](https://img.shields.io/badge/version-1.1.7-brightgreen)

Adds some enhancements for the official [verdaccio-google-cloud](https://github.com/verdaccio/monorepo/tree/master/plugins/google-cloud) plugin:

- adds support for `npm token` commands

## Installation

```sh
npm install @outcome-co/verdaccio-google-cloud
```

## Usage

Configure Verdaccio just as normal with the Google Cloud plugin, but use `@outcome-co/verdaccio-google-cloud` instead of `google-cloud`:

```yaml
store:
  "@outcome-co/verdaccio-google-cloud":
   ## google project id
   projectId: my-project

   ## namespace for metadata database
   kind: verdaccioMeta

   ## this pluging do not create the bucket, it has to exist
   bucket: my-bucket

   ## default validation is, it can be overrided by 
   ## https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/File.html#createWriteStream
   # validation: crc32c

   ## Enable/disable resumable uploads to GC Storage
   ## By default it's enabled in `@google-cloud/storage`
   ## May cause failures for small package uploads so it is recommended to set it to `false`
   ## @see https://stackoverflow.com/questions/53172050/google-cloud-storage-invalid-upload-request-error-bad-request
   resumable: false
```


## Development

Remember to run `./pre-commit.sh` when you clone the repository.

