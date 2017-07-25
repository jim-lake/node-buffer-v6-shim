'use strict';

if (Number(process.version.match(/^v(\d+\.\d+)/)[1]) >= 6.0) {
  return;
}

var oldBuffer = global.Buffer;

function newBuffer(data, encoding, len) {
  return new oldBuffer(data, encoding, len);
}

function newSlowBuffer(data, encoding, len) {
  var SlowBuffer = require('buffer').SlowBuffer;
  return new SlowBuffer(data, encoding, len);
}

if (!Buffer.alloc) {
  Buffer.alloc = newBuffer;
}
if (!Buffer.allocUnsafe) {
  Buffer.allocUnsafe = newBuffer;
}
if (!Buffer.allocUnsafeSlow) {
  Buffer.allocUnsafeSlow = newSlowBuffer;
}
if (!Buffer.from) {
  Buffer.from = newBuffer;
}

try {
  Buffer.from('1337', 'hex');
} catch(e) {
  // replace the whole global object
  var newBufferObject = function() { return oldBuffer.apply(this,arguments); };
  Object.assign(newBufferObject,oldBuffer,{
    from: newBuffer,
  });
  newBufferObject.prototype = oldBuffer.prototype;
  global.Buffer = newBufferObject;
  require('buffer').Buffer = newBufferObject;
}
