function promiseLiteAjax(url, method, postBody, moreArgs) {
    return new Promise((reslove, reject) => {
        liteAjax(url, (d) => {
            reslove(d);
        },method, postBody, moreArgs)
    });
}
