import React from 'react';
import Script from 'next/script';
/**
 * 
 * @returns 

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T9ECBZJPXR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-T9ECBZJPXR');
</script>

 */

const GAScripts: React.FC = () => {
  const GA_ID = process.env.GA_ID || 'G-T9ECBZJPXR';
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="gtag">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
            gtag('config', '${GA_ID}', {
              'site_name': 'connect.mootiez.com'
            });
        `}
      </Script>
    </>
  );
};

export default GAScripts;
