const { HMAC_SHA1 } = require('./HMAC');
const SHA256 = require('./SHA256');

console.log(HMAC_SHA1('Suthinan', 'Musitmani') === 'f87cee9d3e2e922398faa71a020f039301bd01b8');
console.log(SHA256('SuthinanMusitmani') === 'd2a4efe0ae1f728ae51b65763f623dd824cfd709fee3e7ad99f5255e77d8b354');
