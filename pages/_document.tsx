import {Head, Html, Main, NextScript} from 'next/document'


const setInitialTheme = `      
      (function () {
        setInterval(() => {
            let filterButton = document.querySelector('.MuiDataGrid-panelWrapper .MuiButtonBase-root[title="Delete"]');
            if(!filterButton){
                return;
            }
            filterButton.addEventListener("click", function(){
                let filterPanel = document.querySelector('.MuiDataGrid-panel');
                if(filterPanel){
                    document.querySelector('.MuiDataGrid-panel').style.display = "none";
                }
            });
        },1000);
         function readCookie(name) {
          let nameEQ = name + "=";
          let ca = document.cookie.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
          }
          return null;
        }
          let theme = readCookie('theme');
           document.getElementsByTagName('html')[0].setAttribute('data-theme', theme || 'light');
})();
// tawk to
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/628a2860b0d10b6f3e7372a3/1g3lqrf7b';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
  `;

export default function Document() {
    return (
        <Html data-theme={"light"}>
            <Head>
                <title>Minerium</title>
                <script
                    dangerouslySetInnerHTML={{
                        __html: setInitialTheme,
                    }}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat&family=Open+Sans:wght@400;700&family=Poppins:wght@400;700&display=swap"
                    rel="stylesheet"/>
                <link rel="icon" href="/assets/images/favicon.ico?v=1"/>
                <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg?v=1" />
                <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png?v=1" />
                <link rel="manifest" href="/manifest.webmanifest?v=1"/>
                <link rel="manifest" href="/manifest.json?v=1"/>
                <meta name="theme-color" content="#ffffff"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}