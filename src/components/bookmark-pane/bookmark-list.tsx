
import * as React from 'react';
import * as CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {ActionHandler, createDispatchHandler} from '../../actions/redux-action';
import {State} from '../../models/index';
import * as styles from './bookmark-list.scss';

import {InlineData} from 'vega-lite/build/src/data';
import {BookmarkAction} from '../../actions/bookmark';
import {Bookmark} from '../../models/bookmark';
import {ResultPlot} from '../../models/result';
import {selectData} from '../../selectors/dataset';
import {selectBookmark} from '../../selectors/index';
import {Plot} from '../plot';


export interface BookmarkListListProps extends ActionHandler<BookmarkAction> {
  bookmark: Bookmark;
  data: InlineData;
  width?: number;
}

class BookmarkListBase extends React.PureComponent<BookmarkListListProps, {}> {

  constructor(props: BookmarkListListProps) {
    super(props);

    // Bind - https://facebook.github.io/react/docs/handling-events.html
    // this.onAdd = this.onAdd.bind(this);
  }

  public render() {
    const {bookmark, data, width} = this.props;
    const plots: ResultPlot[] = bookmark.list.map(key => bookmark.dict[key].plot);

    const bookmarkPlotListItems = plots.map((plot, index) => {
      const {spec, fieldInfos} = plot;
      return (
        <Plot
          bookmark={this.props.bookmark}
          data={data}
          width={width}
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
      );
    });

    return (
      <div styleName="bookmark-list">
        {
          (bookmarkPlotListItems.length > 0) ?
           bookmarkPlotListItems :
           <div styleName="bookmark-list-empty">空</div>
        }
      </div>
    );

    // const fieldItems = fieldDefs.map(fieldDef => {
    //   const key = stringify(fieldDef);
    //   return (
    //     <div key={key} styleName='field-list-item'>
    //       {this.renderComponent(fieldDef)}
    //     </div>
    //   );
    // });

    // return (
    //   <div styleName={(config.wildcards === 'disabled') ? 'field-list-no-wildcards' : 'field-list'}>
    //     {fieldItems}
    //   </div>
    // );
  }

  // protected onAdd(fieldDef: ShelfFieldDef) {
  //   const {handleAction} = this.props;
  //   handleAction({
  //     type: BOOKMARK_ADD_PLOT,
  //     // payload: {bookmark: bookmark}
  //   });
  // }

  // private renderComponent(fieldDef: ShelfFieldDef) {
  //   const {schema} = this.props;

  //   return (
  //     <Field
  //       fieldDef={fieldDef}
  //       isPill={true}
  //       draggable={true}
  //       onDoubleClick={this.onAdd}
  //       onAdd={this.onAdd}
  //       schema={schema}
  //     />
  //   );
  // }
}

const BookmarkListRenderer = CSSModules(BookmarkListBase, styles);

export const BookmarkList = connect(
  (state: State) => {
    return {
      bookmark: selectBookmark(state),
      data: selectData(state)
    };
  },
  createDispatchHandler<BookmarkAction>()
)(BookmarkListRenderer);
