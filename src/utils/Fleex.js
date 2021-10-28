import fleekStorage from '@fleekhq/fleek-storage-js';

export const getFile = (hash) => await fleekStorage.get({
    apiKey: 'iGf4a54cmG+pJbtI4S6mdg==',
    apiSecret: 'XW/quViqnvK97/b7FkqAgiS4Jup6LdiiaxIzE5kLXk4=',
    key: hash,
    getOptions: [
      'data',
      'bucket',
      'key',
      'hash',
      'publicUrl'
    ],
  });

