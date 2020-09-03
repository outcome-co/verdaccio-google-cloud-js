#
# This is the default config file. It allows all users to do anything,
# so don't use it on production systems.
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/master/conf
#

# path to a directory with all packages
storage: ./storage/
# path to a directory with plugins to include
plugins: ./

web:
  title: Verdaccio
  # comment out to disable gravatar support
  gravatar: false
  # by default packages are ordercer ascendant (asc|desc)
  sort_packages: asc
  # convert your UI to the dark side
  # darkMode: true

# translate your registry, api i18n not available yet
# i18n:
# list of the available translations https://github.com/verdaccio/ui/tree/master/i18n/translations
#   web: en-US

auth:
  # htpasswd:
  #   file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    # max_users: 1000
  "dist":
    organization: <REPLACE WITH YOUR ORG>
    token: <REPLACE WITH YOUR TOKEN>

# a list of other known repositories we can talk to
# uplinks:
#   npmjs:
#     url: https://registry.npmjs.org/

packages:
  '@*/*':
    # scoped packages
    # publish: $authenticated
    # unpublish: $authenticated
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    # access: $authenticated

    # allow all known users to publish/publish packages
    # (anyone can register by default, remember?)
    # publish: $authenticated
    # unpublish: $authenticated

    # # if package is not available locally, proxy requests to 'npmjs' registry
    proxy: npmjs

# You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
# A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
# WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
server:
  keepAliveTimeout: 60

listen:
  - 0.0.0.0:4873

middlewares:
  audit:
    enabled: true

# log settings
logs:
  - { type: stdout, format: pretty, level: trace }
  #- {type: file, path: verdaccio.log, level: info}
#experiments:
#  # support for npm token command
#  token: false
#  # support for the new v1 search endpoint, functional by incomplete read more on ticket 1732
#  search: false

# This affect the web and api (not developed yet)
#i18n:
#web: en-US