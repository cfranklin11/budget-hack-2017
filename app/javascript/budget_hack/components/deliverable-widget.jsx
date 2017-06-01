import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line } from 'recharts';

export default class DeliverableWidget extends Component {
  static propTypes = {
    deliverable: PropTypes.shape({
      name: PropTypes.string,
      metrics: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    budgetChanges: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    budgetChanges: [],
  }

  percentMetricChange = (metrics) => {
    const firstMetric = parseFloat(metrics[0].metric);
    const firstMetricNumber = isNaN(firstMetric) ? 1 : firstMetric;

    const percentChanges = metrics.map((metric) => {
      const thisMetric = parseFloat(metric.metric);
      const metricNumber = isNaN(thisMetric) ? 0 : thisMetric;
      const percentChange = Math.round(
        ((metricNumber / firstMetricNumber) - 1) * 100);

      return { year: metric.year, metric: percentChange };
    });

    return percentChanges;
  }

  lineChartData = (budgetChanges, metricChanges) => {
    const chartData = budgetChanges.map((budget, index) => {
      const metric = metricChanges.length > index ?
        metricChanges[index].metric :
        0;
      return { year: budget.year, budget: budget.budget, metric };
    });

    return chartData;
  }

  render () {
    const { deliverable: { name, metrics }, budgetChanges } = this.props;
    const chartData = this.lineChartData(
      budgetChanges,
      this.percentMetricChange(metrics));

    return (
      <div>
        <span className="deliverable-chart-header__title">
          { name } [ Delete deliverable ]
        </span>
        <div>
          { chartData && chartData.length > 0 && (
            <div className="deliverable-widget">
              <div>
                <h2>% Change: Budget vs Output Measures</h2>
                <LineChart
                  width={ 400 }
                  height={ 250 }
                  data={ chartData }
                  margin={ { top: 5, right: 30, left: 20, bottom: 5 } }>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="budget" stroke="#8884d8" />
                  <Line type="monotone" dataKey="metric" stroke="#82ca9d" />
                </LineChart>
              </div>
            </div>
          ) }
        </div>
      </div>
    );
  }
}
