const globalAny: any = global;

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
const originalLayouts = getFromLS("layouts") || {};
const ResponsiveReactGridLayout = GridLayout.WidthProvider(GridLayout.Responsive);

export interface DashboardPanelProps extends ActionHandler<BookmarkAction>  {
  bookmark: Bookmark;
  data: InlineData;
}

export interface DashboardPanelState {
  layouts: GridLayout.Layout;
}

export class DashboardPaneBase extends React.PureComponent<DashboardPanelProps, DashboardPanelState> {
  constructor(props: DashboardPanelProps) {
    super(props);
    // console.log('---constructor---');
    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
    };
  }

  // static get defaultProps() {
  //   return {
  //     className: "layout",
  //     cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  //     rowHeight: 30,
  //   };
  // }

  public componentWillMount() {
    console.log('---componentWillMount---', getFromLS("layouts"));
    this.setState ({
      layouts: JSON.parse(JSON.stringify(getFromLS("layouts")))
    });
  }

  public onLayoutChange(layout: GridLayout.Layout, layouts: GridLayout.Layout) {
    // console.log('---onLayoutChange---', layout, layouts);
    saveToLS("layouts", layouts);
    this.setState({ layouts });
  }

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
      <ResponsiveReactGridLayout
        className="layout"
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        autoSize={true}
        verticalCompact={true}
        width={1450}
        draggableCancel="input,textarea"
        layouts={this.state.layouts}
        onLayoutChange={(layout: GridLayout.Layout, layouts: GridLayout.Layout) => this.onLayoutChange(layout, layouts)}
      >
        {
          (bookmarkPlotListItems.length > 0) ?
          bookmarkPlotListItems :
          <div styleName="bookmark-list-empty">空</div>
        }
      </ResponsiveReactGridLayout>
    );
  }
}

function getFromLS(key: any) {
  let ls = {};
  if (globalAny.localStorage) {
    try {
      ls = JSON.parse(globalAny.localStorage.getItem("rgl-8")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  // console.log('getFromLS, key, value', key, ls[key]);
  return ls[key];
}

function saveToLS(key: any, value: any) {
  // console.log('saveToLS, key, value', key, value);
  if (globalAny.localStorage) {
    globalAny.localStorage.setItem(
      "rgl-8",
      JSON.stringify({
        [key]: value
      })
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
