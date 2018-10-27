import * as React from "react";
import * as CSSModules from "react-css-modules";
import { connect } from "react-redux";
import { Dataset, State } from "../../models";
import { VoyagerConfig } from "../../models/config";
import { selectConfig, selectDataset } from "../../selectors/";
import { BookmarkList } from "./bookmark-list";
import * as styles from "./bookmark-pane.scss";

import {
  ActionHandler,
  createDispatchHandler,
  DatasetAsyncAction,
} from '../../actions';

export interface BookmarkPanelOwnProps {
  width: number;
}

export interface BookmarkPanelConnectProps {
  data: Dataset;
  config: VoyagerConfig;
}

export type BookmarkPanelProps = BookmarkPanelOwnProps & BookmarkPanelConnectProps & ActionHandler<DatasetAsyncAction>;

export class BookmarkPaneBase extends React.PureComponent<BookmarkPanelProps, {}> {
  public render() {
    const { name } = this.props.data;
    const fieldCount = this.props.data.schema.fieldSchemas.length;

    const fields =
      fieldCount > 0 ? (
        <div styleName="bookmark-pane-section">
          <BookmarkList width={this.props.width}/>
        </div>
      ) : null;

    return (
      <div className="pane" styleName="bookmark-pane">
        {fields}
      </div>
    );
  }
}

const BookmarkPaneRenderer = CSSModules(BookmarkPaneBase, styles);

export const BookmarkPane = connect<BookmarkPanelConnectProps, ActionHandler<DatasetAsyncAction>,
  BookmarkPanelOwnProps>(
  (state: State) => {
    return {
      data: selectDataset(state),
      config: selectConfig(state)
    };
  },
  createDispatchHandler<DatasetAsyncAction>()
)(BookmarkPaneRenderer);
