function promiseLiteAjax(url, method, postBody, moreArgs) {
    return new Promise((reslove, reject) => {
        liteAjax(url, (d) => {
            reslove(d);
        },method, postBody, moreArgs)
    });
}

function read(filename, callback) {
    liteAjax(filename, function(d) {
        if (callback) {
            callback.call(this, d);
        }
    });
}

function saveArray(array, filename) {
    var result = "";
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (typeof item == "string") {
            result += item + "\n";
        } else {
            result += JSON.stringify(item) + "\n";
        }
    }
    save(result, filename);
}

function save(value, filename) {
    doSave(value, "text/latex", filename);
}

function doSave(value, type, name) {
    var blob;
    if (typeof window.Blob == "function") {
        blob = new Blob([value], {type: type});
    } else {
        var BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(value);
        blob = bb.getBlob(type);
    }
    var URL = window.URL || window.webkitURL;
    var bloburl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    if ('download' in anchor) {
        anchor.style.visibility = "hidden";
        anchor.href = bloburl;
        anchor.download = name;
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        anchor.dispatchEvent(evt);
        document.body.removeChild(anchor);
    } else if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, name);
    } else {
        location.href = bloburl;
    }
}

function promiseRead(filePath) {
    return new Promise((reslove, reject) => {
        read(filePath, (d) => {
            reslove(d);
        })
    })
}
    return new Promise((reslove, reject) => {
        read(filePath, (d) => {
            reslove(d);
        })
    })
}