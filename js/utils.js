export function getSearchParameters() {
    function transformToAssocArray( prmstr ) {
        let params = {};
        let prmarr = prmstr.split("&");
        for ( let i = 0; i < prmarr.length; i++) {
            let tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    const prmstr = window.location.search.substr(1);

    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
