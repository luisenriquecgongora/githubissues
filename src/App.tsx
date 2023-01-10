import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Issue, IssuesState, LabelExtended } from './Types/types';
import LabelChart from './Charts/LabelChart';
import { GET_ISSUES, GET_ISSUES_BY_LABELS, GET_OPEN_CLOSED_COUNTS, GET_LABELS } from './Queries/queries';
const repositoryOwner = 'Automattic';
const repositoryName = 'mongoose';

function App() {
  const [labels, setLabels] = useState<LabelExtended[]>([]);
  const [issuesState, setIssuesState] = useState<IssuesState>('OPEN');
  const baseVariables = { first: 7, after: null, last: NaN, before: null, states: issuesState };
  const activeLabels = labels.filter((label) => label.active);
  const variables = activeLabels.length
    ? { ...baseVariables, labels: activeLabels.map((label) => label.name) }
    : baseVariables;

  const { data: dataIssues, refetch } = useQuery(activeLabels.length ? GET_ISSUES_BY_LABELS : GET_ISSUES, {
    variables: variables,
  });

  const { data: dataCounts } = useQuery(GET_OPEN_CLOSED_COUNTS);
  const { data: dataLabels } = useQuery(GET_LABELS, {
    variables: {
      states: issuesState,
    },
  });

  const handleLabelClick = (label: LabelExtended) => {
    const newLabels = labels.map((oldLabel: LabelExtended) => {
      if (label.name === oldLabel.name) return { ...oldLabel, active: !oldLabel.active };
      return oldLabel;
    });
    setLabels(newLabels);
  };

  useEffect(() => {
    if (dataLabels) {
      setLabels(dataLabels.repository.labels.nodes);
    }
  }, [dataLabels]);

  return (
    <div className="px-2 py-3 flex flex-row justify-center pt-11">
      <div>
        <div className="flex items-center mb-5">
          <div className="flex mr-9">
            {repositoryOwner}/{repositoryName}
            <div className="ml-2">( {dataIssues?.repository.issues.totalCount} issues)</div>
          </div>
          <div className="flex mr-8 ml-auto">
            {labels?.map((label: LabelExtended, idx: number) => {
              return (
                <div
                  key={idx}
                  className={`${
                    label.active ? 'bg-neutral-300' : ' bg-neutral-100'
                  } font-medium text-xs h-9 flex items-center justify-center rounded-3xl mr-2 px-4 text-black cursor-pointer`}
                  onClick={() => handleLabelClick(label)}
                >
                  {label.name}
                </div>
              );
            })}
          </div>
          <div className="flex">
            <button
              onClick={() => {
                setIssuesState('OPEN');
              }}
              className={`${
                issuesState === 'OPEN' ? 'bg-neutral-300' : ' bg-neutral-100'
              } font-medium text-xs h-9 flex items-center justify-center rounded-3xl mr-2 px-4 text-black cursor-pointer`}
            >
              {dataCounts?.repository.open.totalCount} &nbsp; Open
            </button>
            <button
              onClick={() => {
                setIssuesState('CLOSED');
              }}
              className={`${
                issuesState === 'CLOSED' ? 'bg-neutral-300' : ' bg-neutral-100'
              } font-medium text-xs  h-9 flex items-center justify-center rounded-3xl mr-2 px-4 text-black cursor-pointer`}
            >
              {dataCounts?.repository.closed.totalCount} &nbsp; Closed
            </button>
          </div>
        </div>
        <div
          className="flex flex-col bg-neutral-100 px-7 pt-9 pb-5 mb-5 rounded-3xl overflow-y-scroll"
          style={{ height: '400px' }}
        >
          {dataIssues?.repository.issues.nodes.map((issue: Issue, idx: number) => {
            return (
              <div
                key={idx}
                className={
                  'bg-neutral-300 font-medium text-sm h-9 flex items-center justify-start rounded-3xl mr-2 px-4 text-black mb-3.5'
                }
              >
                {issue.title}
              </div>
            );
          })}
        </div>
        <div className="flex">
          <button
            disabled={!dataIssues?.repository.issues.pageInfo.hasPreviousPage}
            onClick={() => {
              if (dataIssues?.repository.issues.pageInfo.hasPreviousPage) {
                refetch({
                  first: NaN,
                  after: null,
                  last: 10,
                  before: dataIssues?.repository.issues.pageInfo.startCursor,
                });
              }
            }}
            className={`${
              dataIssues?.repository.issues.pageInfo.hasPreviousPage ? 'cursor-pointer' : ' text-opacity-50'
            } font-medium text-xs bg-neutral-100 h-9 flex items-center justify-center rounded-3xl mr-2 px-4 text-black`}
          >
            Prev
          </button>
          <button
            disabled={!dataIssues?.repository.issues.pageInfo.hasNextPage}
            onClick={() => {
              if (dataIssues?.repository.issues.pageInfo.hasNextPage) {
                refetch({
                  first: 7,
                  after: dataIssues?.repository.issues.pageInfo.endCursor,
                  last: NaN,
                  before: null,
                });
              }
            }}
            className={`${
              dataIssues?.repository.issues.pageInfo.hasNextPage ? 'cursor-pointer' : ' text-opacity-50'
            } font-medium text-xs bg-neutral-100 h-9 flex items-center justify-center rounded-3xl mr-2 px-4 text-black `}
          >
            Next
          </button>
        </div>
      </div>
      <LabelChart labels={labels} />
    </div>
  );
}

export default App;
