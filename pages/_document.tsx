import {Head, Html, Main, NextScript} from 'next/document'


const setInitialTheme = `      
      (function () {
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