module.exports = {
  siteMetadata: {
    title: '홍승아 기술 블로그',
    description: '홍승아 기술 블로그에 오신걸 환영합니다.',
    author: '홍승아',
    type: 'website',
    siteUrl: 'https://seungahhong.github.io/',
    INIT_PER_PAGE_NUMBER: 8,
    social: {
      facebook:
        'https://www.facebook.com/people/%ED%99%8D%EC%8A%B9%EC%95%84/100002349562000/',
      github: 'https://github.com/seungahhong',
      notion:
        'https://material-debt-c1c.notion.site/daa60481e37840ea9e1b7e1b12269942',
      linkedin: 'https://www.linkedin.com/in/seungahhong/',
    },
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'contents',
        path: `${__dirname}/contents`,
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaults: {
          formats: ['auto', 'webp'],
          quality: 100,
          placeholder: 'blurred',
        },
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Add any options here
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-smartypants',
            options: {
              dashes: 'oldschool',
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              icon: '<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>',
              className: 'custom-class',
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1024,
              quality: 100,
              withWebp: true,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {},
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://seungahhong.github.io', // 중복된 페이지 중에서 가장 대표적으로 사용되는 URL 지정
        stripQueryString: true,
      },
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://seungahhong.github.io',
        sitemap: 'https://seungahhong.github.io/sitemap/sitemap-index.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      // The property ID; the tracking code won't be generated without it
      options: {
        trackingId: 'G-TYGQRJE1B8',
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        //  // Setting this parameter is optional
        //  anonymize: true,
        //  // Setting this parameter is also optional
        //  respectDNT: true,
        //  // Avoids sending pageview hits from custom paths
        //  exclude: ["/preview/**", "/do-not-track/me/too/"],
        //  // Delays sending pageview hits on route update (in milliseconds)
        //  pageTransitionDelay: 0,
        //  // Enables Google Optimize using your container Id
        //  optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
        //  // Enables Google Optimize Experiment ID
        //  experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
        //  // Set Variation ID. 0 for original 1,2,3....
        //  variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        //  // Defers execution of google analytics script after page load
        //  defer: false,
        //  // Any additional optional fields
        //  sampleRate: 5,
        //  siteSpeedSampleRate: 10,
        //  cookieDomain: "example.com",
        //  // defaults to false
        //  enableWebVitalsTracking: true,
      },
    },
    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: `gatsby-starter-default`,
    //     short_name: `starter`,
    //     start_url: `/`,
    //     background_color: `#663399`,
    //     // This will impact how browsers show your PWA/website
    //     // https://css-tricks.com/meta-theme-color-and-trickery/
    //     // theme_color: `#663399`,
    //     display: `minimal-ui`,
    //     icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
