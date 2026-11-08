// Google Analytics 4 の測定 ID
export const GA_MEASUREMENT_ID = "G-5RDXY9YMV4";

// void.config.ts の head.script で全ページに入れる。
// 本番のホスト以外(localhost・workers.dev のプレビュー)と、/admin・OGP 画像の撮影で開く /og 配下では
// gtag.js を読み込まず計測しない。ページで分岐できないので、ブラウザ側の location で判定する。
// script は SSR 時だけ出力されるが、クライアント側の遷移は GA4 の拡張計測(履歴の変更)で page_view になる
const loader = `(function(){
if(location.hostname!=="ellreka.net"||/^\\/(admin|og)(\\/|$)/.test(location.pathname))return;
var s=document.createElement("script");
s.async=true;
s.src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}";
document.head.appendChild(s);
window.dataLayer=window.dataLayer||[];
window.gtag=function(){dataLayer.push(arguments);};
gtag("js",new Date());
gtag("config","${GA_MEASUREMENT_ID}");
})();`;

export const analyticsScript = { innerHTML: loader };
