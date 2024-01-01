// SemiCircleGauge.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class SemiCircleGauge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [((props.value / 1000) * 100).toFixed(2)],
      centerValue: props.value,
      options: {
        chart: {
          type: 'radialBar',
          offsetY: -10,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: '#e7e7e7',
              strokeWidth: '80%',
              margin: 10,
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#999',
                opacity: 0.8,
                blur: 2,
              },
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
                offsetY: -2,
                fontSize: '16px',
              },
            },
          },
        },
        grid: {
          padding: {
            top: -5,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91],
          },
        },
        labels: ['Avg Results'],
        colors: [this.getColorForScore(props.value)],
      },
    };
  }

  getColorForScore(score) {
    if (score >= 800) {
      return '#009f48';
    } else if (score >= 750) {
      return '#7cc534';
    } else if (score >= 700) {
      return '#FFC107';
    } else if (score >= 640) {
      return '#ff8e01';
    } else if (score >= 580) {
      return '#ff4312';
    } else {
      return '#cf1321';
    }
  }

  render() {
    const chartHeight = this.props.type === "Table" ? 100 : 180;

    return (
      <div id="chart" className="mx-auto text-center" style={{ width: '100%' }}>
        <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={chartHeight} />
        <div style={{ marginTop: '-30px', fontSize: '20px', color: this.getColorForScore(this.state.centerValue) }}>
          {this.state.centerValue}
        </div>
      </div>
    );
  }
}

export default SemiCircleGauge;