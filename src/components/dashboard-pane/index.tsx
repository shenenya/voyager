import * as React from "react";
import * as CSSModules from "react-css-modules";
import { connect } from "react-redux";
import {InlineData} from 'vega-lite/build/src/data';
import {BookmarkAction} from '../../actions/bookmark';
import {ActionHandler, createDispatchHandler} from '../../actions/redux-action';
import { State } from "../../models";
import {Bookmark} from '../../models/bookmark';
import {ResultPlot} from '../../models/result';
import {selectData} from '../../selectors/dataset';
import {selectBookmark} from '../../selectors/index';
import {Plot} from '../plot';
import * as styles from "./dashboard-pane.scss";

// import * as _ from "lodash";
import * as GridLayout from "react-grid-layout";

export interface DashboardPanelProps extends ActionHandler<BookmarkAction>  {
  bookmark: Bookmark;
  data: InlineData;
}

export class DashboardPaneBase extends React.PureComponent<DashboardPanelProps, {}> {
  public render() {
    const {bookmark, data} = this.props;
    const plots: ResultPlot[] = bookmark.list.map(key => bookmark.dict[key].plot);

    const layout = plots.map((plot, index) => {
      // const w = plot.spec.width;
      // const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (index * 3) % 12,
        y: Math.floor(index / 4) * 9,
        w: 3,
        h: 9
      };
      // , static: true, minW: 2, maxW: 4
    });

    // console.log('layout', layout);
    const bookmarkPlotListItems = plots.map((plot, index) => {
      const {spec, fieldInfos} = plot;
      return (
        <div key={index.toString()} data-grid={layout[index.toString()]}>
          <Plot
            bookmark={this.props.bookmark}
            data={data}
            filters={[]} /* Bookmark specs already have filters included */
            key={index}
            fieldInfos={fieldInfos}
            handleAction={this.props.handleAction}
            isPlotListItem={true}
            showBookmarkButton={true}
            showSpecifyButton={false}
            showCopyButton={false}
            spec={spec}
          />
        </div>
      );
    });

    return(
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={30}
        autoSize={true}
        verticalCompact={true}
        width={1450}
        draggableCancel="input,textarea"
      >
        {
          (bookmarkPlotListItems.length > 0) ?
          bookmarkPlotListItems :
          <div styleName="bookmark-list-empty">空</div>
        }
      </GridLayout>
    );
  }
}

export const DashboardPane = connect(
  (state: State) => {
    return {
      bookmark: selectBookmark(state),
      data: selectData(state)
    };
  },
  createDispatchHandler<BookmarkAction>()
)(CSSModules(DashboardPaneBase, styles));
