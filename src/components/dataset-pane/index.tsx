import * as React from "react";
import * as CSSModules from "react-css-modules";
import { connect } from "react-redux";
import { Dataset, State } from "../../models";
import { VoyagerConfig } from "../../models/config";
import { selectConfig, selectDataset } from "../../selectors/";
import * as styles from "./dataset-pane.scss";

import ReactTable from "react-table";
import * as _ from 'lodash';


export interface DatasetPanelProps {
  data: Dataset;
  config: VoyagerConfig;
}

export class DatasetPaneBase extends React.PureComponent<DatasetPanelProps, {}> {
  render() {
    const { isLoading, data } = this.props.data;
    if (isLoading) {
      return null;
    }

    const headers = Object.keys(this.props.data.data.values[0]);
    const columns = headers.map(x => ({Header: x, accessor: x}));
    console.log('columns', columns);

    return (
          <div styleName="dataset-pane">
              <ReactTable
                data={data.values}
                columns={columns}
                defaultPageSize = {25}
                pageSizeOptions = {[25, 50, 100]}
              />
          </div>
    )
  }
}

export const DatasetPane = connect((state: State) => {
  return {
    data: selectDataset(state),
    config: selectConfig(state)
  };
})(CSSModules(DatasetPaneBase, styles));
