// credit to Joel Richard for the function below: https://stackoverflow.com/questions/1131630/the-param-inverse-function-in-javascript-jquery

function deparam(str) {
    var string = str.replace('?','');
    return string.split('&').reduce(function (params, param) {
        var paramSplit = param.split('=').map(function (value) {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
};
