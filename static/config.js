var rootConfig = {
    indexUrl: 'https://www.ipsebe.com',
    cartUrl:'https://cart.ipsebe.com',
    czUrl:'https://cz.ipsebe.com',
    userUrl: 'https://user.ipsebe.com',
    spUrl: 'https://sp.ipsebe.com',
    wxUrl: 'https://wechat.ipsebe.com',
    toolsUrl: 'https://tools.ipsebe.com'
};
if (location.host.indexOf('localhost') === 0) {
	rootConfig = {
	    indexUrl: '//localhost:8084/ipp',
        cartUrl:'//localhost:8084/portalsite-cnsebe',
        czUrl:'//localhost:8084/cnsebe-notarization-web',
        userUrl: '//localhost:8084/iprp_portal',
        spUrl: '//localhost:8084/sp',
        wxUrl: '//localhost:8084',
        toolsUrl: '//localhost:8084/tools'
	};
}
if (location.host.indexOf('test') === 0) {
	rootConfig = {
        indexUrl: 'https://testwww.ipsebe.com',
        cartUrl:'https://testcart.ipsebe.com',
        czUrl:'https://testcz.ipsebe.com',
        userUrl: 'https://testuser.ipsebe.com',
        spUrl: 'https://testsp.ipsebe.com',
        wxUrl: 'https://testwechat.ipsebe.com',
        toolsUrl: 'https://testtools.ipsebe.com'
    };
}
if (location.host.indexOf('pre') === 0) {
	rootConfig = {
        indexUrl: 'https://prewww.ipsebe.com',
        cartUrl:'https://precart.ipsebe.com',
        czUrl:'https://precz.ipsebe.com',
        userUrl: 'https://preuser.ipsebe.com',
        spUrl: 'https://presp.ipsebe.com',
        wxUrl: 'https://prewechat.ipsebe.com',
        toolsUrl: 'https://pretools.ipsebe.com'
    };
}

window.CONFIG = rootConfig;


















































