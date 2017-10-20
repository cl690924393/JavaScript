/**chrome读写工具*/
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

/** lego库工具 */
function getAllItemsOfBrick(brickId, callback) {
    var limit = 1000;
    var offset = 0;
    var total = 0;
    var results = [];

    getAllItemsOfBrickInner();

    function getAllItemsOfBrickInner() {
        if (offset > total) {
            if (callback) {
                callback.call(this, results, 1);
            }
            return;
        }

        getItemsOfBrick(brickId, offset, limit, function(d) {
            if (d == null) {
                if (callback) {
                    callback.call(this, null);
                }
                return;
            }
            total = d.total;

            for (var i = 0; i < d.result.length; i++) {
                results.push(d.result[i]);
            }

            offset += limit;

            if (callback) {
                callback.call(this, [], Math.min(0.99, offset / total));
            }

            getAllItemsOfBrickInner();
        });
    }
}

function getNeighbours(brickId, msg, size, threshold, callback) {
    var url = "http://chatbot.api.talkmoment.com/lego/engine/neighbors";
    var body = {};
    body.brick_id = brickId;
    body.C = msg;
    body.size = size;
    body.threshold = threshold;

    liteAjax(url, function (d) {
        var json = JSON.parse(d);
        if (json.err_no == 0) {
            var results = json.result;
            if (callback) {
                callback.call(this, results);
            }
            return;
        }
        if (callback) {
            callback.call(this, null);
        }
    }, "post", JSON.stringify(body));
}

function getCommentOfLegoItem(legoItemId, callback) {
    var commentUrl = "http://chatbot.api.talkmoment.com/comment/converse/comment/by/lego_id?lego_id=" + legoItemId;
    liteAjax(commentUrl, function(d) {
        var json = JSON.parse(d);
        if (json.err_no == 0) {
            if (callback) {
                callback.call(this, json.result);
            }
            return;
        }
        if (callback) {
            callback.call(this, null);
        }
    });
}

function promiseGetCommentOfLegoItem(legoItemId) {
    return new Promise((reslove, reject) => {
        getCommentOfLegoItem(legoItemId, (d) => {
            reslove(d);
        });
    })
}
/** update */


/** delete */
function deleteLegoItem(brickId, legoItemId, callback) {
    var body = {};
    body.brick_id = brickId;
    body.id = legoItemId;
    var url = "http://lego.api.jndroid.com/lego/del";
    liteAjax(url, function(d) {
        if (callback) {
            callback.call(this, d);
        }
    }, "post", JSON.stringify(body));
}

function promiseDeleteLegoItem(brickId, legoItemId) {
    return new Promise((resolve, reject) => {
        deleteLegoItem(brickId, legoItemId, (d) => {
            resolve(d);
        })
    })
}