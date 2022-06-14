import React, { FunctionComponent } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import PostContent from 'components/Post/PostContent';
import Template from 'components/Base/Template';

type PostTemplateProps = {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: string;
        type: string;
        siteUrl: string;
        social: {
          facebook: string;
          github: string;
          notion: string;
          linkedin: string;
        };
      };
    };
    allMarkdownRemark: {
      edges: [
        {
          node: {
            id: string;
            frontmatter: {
              title: string;
              date: string;
              categories: string;
              tags: string[];
            };
            html: string;
            tableOfContents: string;
          };
        },
      ];
    };
    allFile: {
      edges: [
        {
          node: {
            name: string;
            childImageSharp: {
              gatsbyImageData: IGatsbyImageData;
            };
            publicURL: string;
          };
        },
      ];
    };
  };
  pageContext: {
    previous?: {
      frontmatter: {
        title: string;
      };
      fields: {
        slug: string;
      };
    };
    next?: {
      frontmatter: {
        title: string;
      };
      fields: {
        slug: string;
      };
    };
    slug: string;
  };
};

const PostTemplate: FunctionComponent<PostTemplateProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl, social },
    },
    allMarkdownRemark,
    allFile,
  },
  pageContext,
}) {
  const {
    node: { html, tableOfContents, frontmatter },
  } = allMarkdownRemark?.edges[0];

  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      social={social}
    >
      <PostContent
        {...frontmatter}
        html={html}
        tableOfContents={tableOfContents}
        pageContext={pageContext}
        social={social}
        allFile={allFile}
      />
    </Template>
  );
};

export default PostTemplate;

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    site {
      siteMetadata {
        title
        description
        author
        type
        siteUrl
        social {
          facebook
          github
          notion
          linkedin
        }
      }
    }
    allFile(
      filter: {
        extension: { regex: "/(jpg)|(jpeg)|(png)|(svg)/" }
        relativeDirectory: { eq: "images/header" }
      }
    ) {
      edges {
        node {
          name
          publicURL
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
            category
            tags
          }
          tableOfContents
        }
      }
    }
  }
`;
