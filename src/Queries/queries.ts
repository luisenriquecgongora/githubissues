import { gql } from '@apollo/client';

export const GET_ISSUES = gql`
  query ($first: Int, $after: String, $last: Int, $before: String, $states: [IssueState!]) {
    repository(owner: "Automattic", name: "mongoose") {
      issues(
        first: $first
        after: $after
        last: $last
        before: $before
        orderBy: { field: CREATED_AT, direction: DESC }
        states: $states
      ) {
        nodes {
          id
          title
          publishedAt
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
    }
  }
`;

export const GET_ISSUES_BY_LABELS = gql`
  query ($first: Int, $after: String, $last: Int, $before: String, $states: [IssueState!], $labels: [String!]) {
    repository(owner: "Automattic", name: "mongoose") {
      issues(
        first: $first
        after: $after
        last: $last
        before: $before
        orderBy: { field: CREATED_AT, direction: DESC }
        states: $states
        labels: $labels
      ) {
        nodes {
          id
          title
          publishedAt
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
          hasPreviousPage
        }
        totalCount
      }
    }
  }
`;

export const GET_OPEN_CLOSED_COUNTS = gql`
  query {
    repository(owner: "Automattic", name: "mongoose") {
      open: issues(states: OPEN) {
        totalCount
      }
      closed: issues(states: CLOSED) {
        totalCount
      }
    }
  }
`;

export const GET_LABELS = gql`
  query ($states: [IssueState!]) {
    repository(owner: "Automattic", name: "mongoose") {
      labels(first: 6) {
        nodes {
          id
          name
          color
          issues(states: $states) {
            totalCount
          }
        }
      }
    }
  }
`;
