import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer } from 'recharts';
import ProgramWidget from './program-widget';

export default class DepartmentWidget extends Component {
  static propTypes = {
    departments: PropTypes.shape({
      currentDepartment: PropTypes.string,
      department: PropTypes.object,
      list: PropTypes.arrayOf(PropTypes.string),
      addedPrograms: PropTypes.arrayOf(PropTypes.object),
    }),
    addProgram: PropTypes.func,
    removeProgram: PropTypes.func,
  }

  static defaultProps = {
    departments: {},
    addProgram: () => { return null; },
    removeProgram: () => { return null; },
  }

  constructor () {
    super();

    this.state = {
      isProgListVisible: false,
    };
  }

  showPrograms = () => {
    this.setState({ isProgListVisible: true });
  }

  addProgram = (name) => {
    return () => {
      this.props.addProgram(name);
      this.setState({ isProgListVisible: false });
    };
  }

  render () {
    const { isProgListVisible } = this.state;
    const {
      departments: { department, addedPrograms },
      removeProgram,
    } = this.props;
    const { name, programs, chart_data } = department || {};
    const currentBudget = (department && department.current_budget) || 0;
    const percentBudgetChange =
      (department && department.percent_budget_change) || 0;

    return (
      <div className="programs">
        <h1 aria-label="Programs" className="programs__department-name">
          <i aria-hidden="true" className="material-icons">
            keyboard_arrow_right
          </i>
          { name }
        </h1>
        { !isProgListVisible && (
          <div>
            <div className="chart-area">
              <div className="chart-header">
                <div className="chart-header__budget-amount">
                  <span>
                    {`Budget 2016 / 2017: $${parseInt(currentBudget, 10)} million`}
                  </span>
                </div>
                <div className="chart-header__percentage-change">
                  <span>
                    Change from previous year
                    <span className="chart-header__percentage-number">
                      {`${percentBudgetChange}%`}
                    </span>
                  </span>
                </div>
              </div>
              { chart_data && (
                <div className="chart-widget">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={ 400 } height={ 250 } data={ chart_data }>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="budget" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) }
            </div>
            <div className="select-program-area">
              <button
                className="button--add-programs"
                type="button"
                onClick={ this.showPrograms }>
                <i className="material-icons">add_circle_outline</i>
                <span> Add a Program</span>
              </button>
            </div>
          </div>
        ) }
        { isProgListVisible && (
          <div className="content-wrapper">
            <div className="list-wrapper is--programs" >
              <ul className="list">
                { programs.map((program) => {
                  return (
                    <li className="list__item" key={ program.id }>
                      <button
                        aria-label={ program.name }
                        onClick={ this.addProgram(program.name) }>
                        { program.name }
                      </button>
                    </li>
                  );
                }) }
              </ul>
            </div>
          </div>
        ) }
        <ul className="program-list">
          { addedPrograms.map((program) => {
            return (
              <ProgramWidget
                removeProgram={ removeProgram }
                key={ program.id }
                program={ program }
                addDeliverable={ this.addDeliverable } />
            );
          })
          }
        </ul>
        <div className="select-program-area">
          <button className="button--share" type="button">
            <span>Share</span>
            <i className="material-icons">share</i>
          </button>
        </div>
      </div>
    );
  }
}