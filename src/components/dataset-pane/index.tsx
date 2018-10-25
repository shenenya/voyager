import * as React from "react";
import * as CSSModules from "react-css-modules";
import { connect } from "react-redux";
import { Dataset, State } from "../../models";
import { VoyagerConfig } from "../../models/config";
import { selectConfig, selectDataset } from "../../selectors/";
import * as styles from "./dataset-pane.scss";

import ReactTable from "react-table";


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
    // console.log('columns', columns);

    return (
          <div styleName="dataset-pane">
              <ReactTable
                previousText='前一页'
                nextText='后一页'
                loadingText='正在读取...'
                noDataText='无数据'
                pageText='页'
                ofText='/'
                rowsText='行'
                data={data.values as any}
                columns={columns}
                defaultPageSize = {25}
                pageSizeOptions = {[25, 50, 100]}
              />
          </div>
    );
  }
}

export const DatasetPane = connect((state: State) => {
  return {
    data: selectDataset(state),
    config: selectConfig(state)
  };
})(CSSModules(DatasetPaneBase, styles));
