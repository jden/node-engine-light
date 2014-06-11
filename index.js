var resolved = require('resolved')

function EngineLight() {
  this._dependencies = []
  this._resources = {}
}

EngineLight.prototype.addDependency = function(dependency) {
  if (typeof(dependency) === 'string') {
    this._dependencies.push(dependency)
  }
  else {
    throw new TypeError('dependency must be a string')
  }
}

EngineLight.prototype.addResource = function(resource, percentage) {
  percentage = typeof(percentage) === 'function' ? percentage : (function(){return 0})
  if (typeof(resource) === 'string') {
    this._resources[resource] = percentage
  }
  else {
    throw new TypeError('resource must be a string')
  }
}

function executeResourceFunctions(resources) {
  var updated_resources = {}

  for (resource in resources) {
    updated_resources[resource] = resources[resource]()
  }

  return updated_resources
}

// (String?) => Promise<Object>
EngineLight.prototype.buildResponseObject = function (status) {
  return resolved({
    'status': status,
    'updated': new Date().getTime(),
    'dependencies': this._dependencies,
    'resources': executeResourceFunctions(this._resources)
  })
}

// (String?) => Promise<String>
EngineLight.prototype.getStatus = function (status) {
  status = status || 'ok'
  return this.buildResponseObject(status).then(function (val) {
    return JSON.stringify(val)
  })
}

module.exports = EngineLight
