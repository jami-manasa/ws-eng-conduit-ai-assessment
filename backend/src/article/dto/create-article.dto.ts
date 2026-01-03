export class CreateArticleDto {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList: string[];

  // List of user IDs selected as co-authors
  readonly coAuthorIds?: number[];
}
