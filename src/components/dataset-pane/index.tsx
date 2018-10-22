import * as React from "react";
import * as CSSModules from "react-css-modules";
import { connect } from "react-redux";
// import { FieldList, PresetWildcardFieldList } from "./field-list";
import { Dataset, State } from "../../models";
import { VoyagerConfig } from "../../models/config";
import { selectConfig, selectDataset } from "../../selectors/";
// import { DataSelector } from "../data-selector";
import * as styles from "./dataset-pane.scss";


export interface DatasetPanelProps {
  data: Dataset;
  config: VoyagerConfig;
}

export class DatasetPaneBase extends React.PureComponent<DatasetPanelProps, {}> {
  public render() {
    // const { name } = this.props.data;

    return (
          <div>
              数据
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
