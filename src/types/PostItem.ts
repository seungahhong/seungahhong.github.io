import { IGatsbyImageData } from 'gatsby-plugin-image';

export type PostFrontmatterType = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData;
    };
  };
};

export type PostFieldsSlugType = {
  slug: string;
};

export type PostListItemType = {
  node: {
    id: string;
    fields: PostFieldsSlugType;
    excerpt: string;
    frontmatter: PostFrontmatterType;
  };
};
