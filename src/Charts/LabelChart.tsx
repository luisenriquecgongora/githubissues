import React from 'react';
import ReactECharts from 'echarts-for-react';
import { LabelExtended} from '../Types/types';


interface LabelChartProps {
  labels: LabelExtended[];
}

const LabelChart: React.FC<LabelChartProps> = ({labels})=>{
  return (
    <div className='bg-neutral-100 rounded-3xl ml-3 mt-14' style={{width: '300px', height: '400px'}}>
    <ReactECharts
      style={{height: '330px', width: '300px'}}
      option={{
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          bottom: 'bottom',
          height: '80px',
          icon: 'circle',
        },
        series: [
          {
            name: 'Labels',
            type: 'pie',
            center: ['150px', '105px'],
            radius: ['70px', '85px'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
            },
            data: labels.map((label) => {
              return { value: label.issues.totalCount, name: label.name };
            }),
          },
        ],
      }}
    />
    </div>
  );
}

export default LabelChart;
