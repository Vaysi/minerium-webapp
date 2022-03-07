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
        <Html  data-theme={"light"}>
            <Head>
                <title>Minerium</title>
                <script
                    dangerouslySetInnerHTML={{
                        __html: setInitialTheme,
                    }}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"} />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat&family=Open+Sans:wght@400;700&family=Poppins:wght@400;700&display=swap"
                    rel="stylesheet"/>
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}