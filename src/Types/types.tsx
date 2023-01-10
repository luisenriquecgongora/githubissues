export interface Issue {
  id: string;
  title: string;
  publishedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  issues: {
    totalCount: number;
  };
}

export type IssuesState = 'OPEN' | 'CLOSED';

export interface LabelExtended extends Label {
  active: boolean;
}
