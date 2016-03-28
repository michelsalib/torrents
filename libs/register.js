var Registry = require('winreg');
var Promise = require('bluebird');

function createCommand(path, command) {
    var commandKey = new Registry({
        hive: Registry.HKCR,
        key: '\\' + path + '\\shell\\open\\command'
    });

    return Promise.promisify(commandKey.create, {
            context: commandKey
        })()
        .then(function () {
            var setValue = Promise.promisify(commandKey.set, {
                context: commandKey
            });

            return setValue('', Registry.REG_SZ, command);
        })
}

function registerFile(appName, extension, fileType) {
    var fileKey = new Registry({
        hive: Registry.HKCR,
        key: '\\' + extension
    });

    return Promise.promisify(fileKey.create, {
            context: fileKey
        })()
        .then(function () {
            var setValue = Promise.promisify(fileKey.set, {
                context: fileKey
            });

            return Promise.all([
                setValue('', Registry.REG_SZ, appName),
                setValue('Content Type', Registry.REG_SZ, fileType)
            ]);
        });
}

function registerProtocol(protocol, name, type, command) {
    var protocolKey = new Registry({
        hive: Registry.HKCR,
        key: '\\' + protocol
    });

    return Promise.promisify(protocolKey.create, {
            context: protocolKey
        })()
        .then(function () {
            var setValue = Promise.promisify(protocolKey.set, {
                context: protocolKey
            });

            return Promise.all([
                setValue('', Registry.REG_SZ, name),
                setValue('Content Type', Registry.REG_SZ, type),
                setValue('URL Protocol', Registry.REG_SZ, ''),
                createCommand(protocol, command)
            ]);
        });
}

function registerApp(name, type, command) {
    var appKey = new Registry({
        hive: Registry.HKCR,
        key: '\\' + name
    });

    return Promise.promisify(appKey.create, {
            context: appKey
        })()
        .then(function () {
            var contentKey = new Registry({
                hive: Registry.HKCR,
                key: '\\' + name + '\\Content Type'
            });

            return Promise.all([
                Promise.promisify(contentKey.create, {
                    context: contentKey
                })().then(function () {
                    var setValue = Promise.promisify(contentKey.set, {
                        context: contentKey
                    });

                    return setValue('', Registry.REG_SZ, type)
                }),
                createCommand(name, command)
            ]);
        });
}

function register(appName, command, extension, fileType, protocol) {
    return Promise.all([
            registerFile(appName, extension, fileType),
            registerProtocol(protocol.protocol, protocol.name, protocol.type, command),
            registerApp(appName, fileType, command)
        ])
        .catch(function (err) {
            console.error(err);
        });
}

module.exports = {};
module.exports.register = register;
