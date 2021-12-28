export type PostFrontmatterType = {
  title: string;
  date: string;
  categories: string;
  tags: string[];
};

export type PostFieldsSlugType = {
  slug: string;
};

export type PostListItemType = {
  node: {
    id: string;
    fields: PostFieldsSlugType;
    frontmatter: PostFrontmatterType;
  };
};
